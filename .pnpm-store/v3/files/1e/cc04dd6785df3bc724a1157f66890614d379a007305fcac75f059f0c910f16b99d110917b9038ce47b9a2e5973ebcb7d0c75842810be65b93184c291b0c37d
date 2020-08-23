'use strict'

var test = require('tap').test
const serializer = require('../lib/err')
var wrapErrorSerializer = require('../').wrapErrorSerializer

test('serializes Error objects', function (t) {
  t.plan(3)
  var serialized = serializer(Error('foo'))
  t.is(serialized.type, 'Error')
  t.is(serialized.message, 'foo')
  t.match(serialized.stack, /err\.test\.js:/)
})

test('serializes Error objects with extra properties', function (t) {
  t.plan(5)
  var err = Error('foo')
  err.statusCode = 500
  var serialized = serializer(err)
  t.is(serialized.type, 'Error')
  t.is(serialized.message, 'foo')
  t.ok(serialized.statusCode)
  t.is(serialized.statusCode, 500)
  t.match(serialized.stack, /err\.test\.js:/)
})

test('serializes nested errors', function (t) {
  t.plan(7)
  var err = Error('foo')
  err.inner = Error('bar')
  var serialized = serializer(err)
  t.is(serialized.type, 'Error')
  t.is(serialized.message, 'foo')
  t.match(serialized.stack, /err\.test\.js:/)
  t.is(serialized.inner.type, 'Error')
  t.is(serialized.inner.message, 'bar')
  t.match(serialized.inner.stack, /Error: bar/)
  t.match(serialized.inner.stack, /err\.test\.js:/)
})

test('prevents infinite recursion', function (t) {
  t.plan(4)
  var err = Error('foo')
  err.inner = err
  var serialized = serializer(err)
  t.is(serialized.type, 'Error')
  t.is(serialized.message, 'foo')
  t.match(serialized.stack, /err\.test\.js:/)
  t.notOk(serialized.inner)
})

test('cleans up infinite recursion tracking', function (t) {
  t.plan(8)
  var err = Error('foo')
  var bar = Error('bar')
  err.inner = bar
  bar.inner = err

  serializer(err)
  var serialized = serializer(err)

  t.is(serialized.type, 'Error')
  t.is(serialized.message, 'foo')
  t.match(serialized.stack, /err\.test\.js:/)
  t.ok(serialized.inner)
  t.is(serialized.inner.type, 'Error')
  t.is(serialized.inner.message, 'bar')
  t.match(serialized.inner.stack, /Error: bar/)
  t.notOk(serialized.inner.inner)
})

test('err.raw is available', function (t) {
  t.plan(1)
  const err = Error('foo')
  const serialized = serializer(err)
  t.equal(serialized.raw, err)
})

test('pass through anything that is not an Error', function (t) {
  t.plan(3)

  function check (a) {
    t.is(serializer(a), a)
  }

  check('foo')
  check({ hello: 'world' })
  check([1, 2])
})

test('can wrap err serializers', function (t) {
  t.plan(5)
  var err = Error('foo')
  err.foo = 'foo'
  var serializer = wrapErrorSerializer(function (err) {
    delete err.foo
    err.bar = 'bar'
    return err
  })
  var serialized = serializer(err)
  t.is(serialized.type, 'Error')
  t.is(serialized.message, 'foo')
  t.match(serialized.stack, /err\.test\.js:/)
  t.notOk(serialized.foo)
  t.is(serialized.bar, 'bar')
})
