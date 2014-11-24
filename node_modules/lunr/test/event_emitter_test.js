module('lunr.EventEmitter')

test('adding an event listener', function () {
  var emitter = new lunr.EventEmitter,
      handler = function () {}

  emitter.addListener('test', handler)

  ok('test' in emitter.events)
  ok(emitter.events.test.indexOf(handler) > -1)
})

test('adding a listener to multiple events', function () {
  var emitter = new lunr.EventEmitter,
      handler = function () {}

  emitter.addListener('foo', 'bar', 'baz', handler)

  ok('foo' in emitter.events)
  ok('bar' in emitter.events)
  ok('baz' in emitter.events)

  ok(emitter.events.foo.indexOf(handler) > -1)
  ok(emitter.events.bar.indexOf(handler) > -1)
  ok(emitter.events.baz.indexOf(handler) > -1)
})

test('removing a single event listener', function () {
  var emitter = new lunr.EventEmitter,
      handler = function () {}

  emitter.addListener('test', handler)

  ok('test' in emitter.events)
  ok(emitter.events.test.indexOf(handler) > -1)

  emitter.removeListener('test', handler)

  ok(!('test' in emitter.events))
})

test('removing a single event listener from many listeners', function () {
  var emitter = new lunr.EventEmitter,
      handler = function () {},
      otherHandler = function () {}

  emitter.addListener('test', handler)
  emitter.addListener('test', otherHandler)

  ok('test' in emitter.events)
  ok(emitter.events.test.indexOf(handler) > -1)

  emitter.removeListener('test', handler)

  ok('test' in emitter.events)
  equal(emitter.events.test.indexOf(handler), -1)
  ok(emitter.events.test.indexOf(otherHandler) > -1)
})

test('emitting events', function () {
  var emitter = new lunr.EventEmitter,
      callbackCalled = false,
      callbackArguments = [],
      callback = function () {
        callbackArguments = Array.prototype.slice.call(arguments)
        callbackCalled = true
      }

  emitter.emit('test', 1, 'a')
  emitter.addListener('test', callback)
  emitter.emit('test', 1, 'a')

  ok(callbackCalled)
  deepEqual(callbackArguments, [1, 'a'])
})
