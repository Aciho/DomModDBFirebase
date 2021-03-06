import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  actions: {
    disabledSubmitAction(param) {
      console.log(this.get('email'));
      console.log(this.get('password'));
      const authRef = this.get('firebaseApp').auth();
      authRef.createUserWithEmailAndPassword(this.get('email'), this.get('password'))
        .then((response) => {
          console.log("responded");
          console.log(response);
          this.get('firebaseApp').auth().currentUser.updateProfile({
            displayName: this.get('name')
          })
        })
        .then(() => {
          this.transitionToRoute('mods');
        })
        .catch(function(error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  },
  emailValidation: [{
    message: 'Please provide email in a valid format',
    validate: (inputValue) => {
      let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailPattern.test(inputValue);
    }
  }]
});
