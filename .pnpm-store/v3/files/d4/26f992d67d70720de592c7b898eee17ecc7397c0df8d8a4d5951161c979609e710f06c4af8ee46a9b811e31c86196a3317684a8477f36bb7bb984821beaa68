/** Tests for Unix Crypt **/
let assert = require('assert');
let unixCryptTD = require('../src/unix-crypt-td.js');

describe('unixCryptTD', function() {
  it('should equal output of crypt(3)', function() {
    assert.equal(unixCryptTD('foo', 'ba'), 'ba4TuD1iozTxw');
    assert.equal(unixCryptTD('random long string', 'hi'), 'hib8W/d4WOlU.');
    assert.equal(unixCryptTD('foob', 'ar'), 'arlEKn0OzVJn.');
    assert.equal(unixCryptTD('Hello World! This is Unix crypt(3)!', 'ux'),
    	    'uxNS5oJDUz4Sc');
  });
});
