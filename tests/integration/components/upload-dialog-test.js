import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('upload-dialog', 'Integration | Component | upload dialog', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`<div id="paper-wormhole"></div>{{upload-dialog}}`);

  assert.equal(this.$().text().includes('choose a mod file to upload'), true);
});

test('DB upload', function(assert) {
  this.render(hbs`<div id="paper-wormhole"></div>{{upload-dialog}}`);
  assert.expect(0);

  // Acceptance testing for firebaseutil isn't in yet
});
