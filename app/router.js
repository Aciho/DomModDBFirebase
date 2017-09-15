import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('mods');
  this.route('mod', { path: '/mod/:dom-mod_id' });
  this.route('register');
  this.route('login');
  this.route('user');
});

export default Router;
