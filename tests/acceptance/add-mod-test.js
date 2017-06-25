import { test } from 'qunit';
import moduleForAcceptance from 'dom-mod-dbfirebase/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | add mod');

test('show dialog', function(assert) {
  assert.equal(find('.modal_header').text(), '');
  visit('/');
  click('#showUploadDialog');
  andThen(function() {
    assert.equal(find('.modal_header').text(), 'Add new mod');
  });
});

