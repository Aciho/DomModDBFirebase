import { test } from 'qunit';
import moduleForAcceptance from 'dom-mod-dbfirebase/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | list mods');

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
  });
});
