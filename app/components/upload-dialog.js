import Ember from 'ember';
import randomId from 'npm:random-id';

export default Ember.Component.extend({
  firebaseApp: Ember.inject.service(),
  actions: {
    closeDialog(param) {
      this.get('doClose')(param)
    },
    uploadArchiveAction(event) {
      const file = event.currentTarget.files[0];
      const storageRef = this.get('firebaseApp').storage().ref();
      const fileRef = storageRef.child(`uploads/${randomId(6,'Aa0')}_${file.name}`);

      fileRef.put(file).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot, snapshot.a.fullPath);
        this.filePath = snapshot.a.fullPath;
      });
    },
    submitFormAction() {
      const store = this.get('_targetObject.store');
      const newMod = store.createRecord('dom-mod', {
        title: this.title,
        subtitle: this.subtitle,
        type: this.type,
        version: this.version,
        description: this.description
      });
      newMod.save();
      this.get('doClose')(true)
    }
  },
  groupedTypes: [
    { groupName: 'Nation Mods', options: ['Early Era', 'Middle Era', 'Late Era', 'Other Era'] },
    { groupName: 'Other Mods', options: ['Balance Mod', 'Total Conversion', 'NationGen', 'Additional Content', 'Other'] }
  ],
  showForm: true
});
