import Ember from 'ember';

export default Ember.Controller.extend({
  firebaseApp: Ember.inject.service(),
  actions: {
    disabledSubmitAction(param) {
      console.log(this.get('email'));
      console.log(this.get('password'));
      const storageRef = this.get('firebaseApp').storage().ref();
      const authRef = this.get('firebaseApp').auth();
      console.log(storageRef, authRef);
      authRef.createUserWithEmailAndPassword(this.get('email'), this.get('password'))
        .then((response) => {
          console.log("responded");
          console.log(response);
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
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
