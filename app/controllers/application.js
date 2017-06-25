import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showUploadDialog() {
      this.set('showDialog', true);
    },
    closeUploadDialog() {
      this.set('showDialog', false);
    },
    filterMods(filter) {
      this.transitionToRoute('mods');
    }
  }
});
