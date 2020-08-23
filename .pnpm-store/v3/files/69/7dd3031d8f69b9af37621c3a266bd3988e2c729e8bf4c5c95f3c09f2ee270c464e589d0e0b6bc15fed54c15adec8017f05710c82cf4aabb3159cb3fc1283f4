'use strict';
const assert = require('assert');
const format = require('../');

// assert.equal(format([]), '');
// assert.equal(format(['']), '');
// assert.equal(format([[]]), '[]');
// assert.equal(format([{}]), '{}');
// assert.equal(format([null]), 'null');
// assert.equal(format([true]), 'true');
// assert.equal(format([false]), 'false');
// assert.equal(format(['test']), 'test');

// // // CHECKME this is for console.log() compatibility - but is it *right*?
// assert.equal(format(['foo', 'bar', 'baz']), 'foo bar baz');

// ES6 Symbol handling
const symbol = Symbol('foo')
assert.equal(format(null, [symbol]), symbol);
assert.equal(format('foo', [symbol]), 'foo Symbol(foo)');
assert.equal(format('%s', [symbol]), 'Symbol(foo)');
assert.equal(format('%j', [symbol]), 'undefined');
assert.throws(function() {
  format(['%d', symbol]);
}, TypeError);

assert.equal(format('%d', [42.0]), '42');
assert.equal(format('%d', [42]), '42');
assert.equal(format('%s', [42]), '42');
assert.equal(format('%j', [42]), '42');

assert.equal(format('%d', [undefined]), '%d');
assert.equal(format('%s', [undefined]), 'undefined');
assert.equal(format('%j', [undefined]), '%j');


assert.equal(format('%d', [null]), '%d');
assert.equal(format('%s', [null]), 'null');
assert.equal(format('%j', [null]), 'null');


assert.equal(format('%d', ['42.0']), '42');
assert.equal(format('%d', ['42']), '42');
assert.equal(format('%s', ['42']), '42');
// assert.equal(format('%j', ['42']), '"42"');

// assert.equal(format('%%s%s', ['foo']), '%sfoo');

assert.equal(format('%s', []), '%s');
assert.equal(format('%s', [undefined]), 'undefined');
assert.equal(format('%s', ['foo']), 'foo');
assert.equal(format('%s', ['\"quoted\"']), '\"quoted\"');
assert.equal(format('%j', [{ s: '\"quoted\"' }]), '{\"s\":\"\\"quoted\\"\"}');
assert.equal(format('%s:%s', []), '%s:%s');
assert.equal(format('%s:%s', [undefined]), 'undefined:%s');
assert.equal(format('%s:%s', ['foo']), 'foo:%s');
assert.equal(format('%s:%s', ['foo', 'bar']), 'foo:bar');
assert.equal(format('%s:%s', ['foo', 'bar', 'baz']), 'foo:bar baz');
assert.equal(format('%s%s', []), '%s%s');
assert.equal(format('%s%s', [undefined]), 'undefined%s');
assert.equal(format('%s%s', ['foo']), 'foo%s');
assert.equal(format('%s%s', ['foo', 'bar']), 'foobar');
assert.equal(format('%s%s', ['foo', 'bar', 'baz']), 'foobar baz');

assert.equal(format(null, ['foo', null, 'bar']), 'foo null bar');
assert.equal(format(null, ['foo', undefined, 'bar']), 'foo undefined bar');

assert.equal(format(null, [null, 'foo']), 'null foo');
assert.equal(format(null, [undefined, 'foo']), 'undefined foo');

// // assert.equal(format(['%%%s%%', 'hi']), '%hi%');
// // assert.equal(format(['%%%s%%%%', 'hi']), '%hi%%');

// (function() {
//   var o = {};
//   o.o = o;
//   assert.equal(format(['%j', o]), '[Circular]');
// })();
