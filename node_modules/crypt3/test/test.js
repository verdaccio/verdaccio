var assert = require('assert')
var crypt3 = require('../')

assert.throws(function() {
	crypt3()
}, /Wrong arguments/)

assert.equal(crypt3('pass', 'salt'), 'sa5JEXtYx/rm6')
assert.equal(crypt3('pass', 'sa5JEXtYx/rm6'), 'sa5JEXtYx/rm6')

var hash = crypt3('password')
assert.equal(crypt3('password', hash), hash)
assert.notEqual(crypt3('bad-pass', hash), hash)

