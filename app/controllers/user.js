import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  actions: {
    logout() {
      this.get('firebaseApp').auth().signOut().then(() => {
        console.log("Sign-out no error.");
        this.get('firebaseApp').auth().onAuthStateChanged((user) => {
          this.transitionToRoute('mods');
        });
      }).catch(function(error) {
        console.error(error);
      });
    }
  }
});
