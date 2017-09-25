import Ember from 'ember';

export default Ember.Component.extend({
  loggedIn: false,
  loginResponse: false,
  displayName: "",
  firebaseApp: Ember.inject.service(),
  init() {
    this._super(...arguments);
    this.get('firebaseApp').auth().onAuthStateChanged((user) => {
      if (this.isDestroyed) {
        return;
      }

      this.user = user;
      Ember.trySet(this, 'loginResponse', true);

      if (user) {
        Ember.trySet(this, 'loggedIn', true);
        Ember.trySet(this, 'displayName', user.displayName);
      } else {
        Ember.trySet(this, 'loggedIn', false);
        Ember.trySet(this, 'displayName', "");
      }
    });
  }
});
