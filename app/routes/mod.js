import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    const theData = this.get('store').findRecord('dom-mod', params["dom-mod_id"]);
    console.log(theData);
    return theData;
  }
});
