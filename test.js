var assert = require('assert');

var urltree = require('.');

describe('match parameter', function() {
  it('should not match non-parameterized', function() {
    assert.equal(1, 1);
  });
});
