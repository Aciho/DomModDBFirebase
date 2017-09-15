import Ember from 'ember';

export default Ember.Component.extend({
  loggedIn: false,
  loginResponse: false,
  displayName: "",
  firebaseApp: Ember.inject.service(),
  init() {
    this._super(...arguments);
    this.get('firebaseApp').auth().onAuthStateChanged((user) => {
      console.log("auth changed");
      this.user = user;
      this.set('loginResponse', true);

      if (user) {
        this.set('loggedIn', true);
        this.set('displayName', user.displayName);
        console.log("logged in");
      } else {
        this.set('loggedIn', false);
        this.set('displayName', "");
        console.log("logged out");
      }
    });
  }
});
