import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  actions: {
    async downloadButton() {
      const storageRef = this.get('firebaseApp').storage().ref();
      const downloadUrl =
        await storageRef.child('uploads/' + this.get('model.filename'))
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            return url;
          });
      window.location.href = (downloadUrl);
    }
  }
});
