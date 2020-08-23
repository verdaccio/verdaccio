'use strict'

var http = require('http')
var test = require('tap').test
var serializers = require('../lib/res')
var wrapResponseSerializer = require('../').wrapResponseSerializer

test('res.raw is not enumerable', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    var serialized = serializers.resSerializer(res)
    t.is(serialized.propertyIsEnumerable('raw'), false)
    res.end()
  }
})

test('res.raw is available', function (t) {
  t.plan(2)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    res.statusCode = 200
    var serialized = serializers.resSerializer(res)
    t.ok(serialized.raw)
    t.is(serialized.raw.statusCode, 200)
    res.end()
  }
})

test('can wrap response serializers', function (t) {
  t.plan(3)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  var serializer = wrapResponseSerializer(function (res) {
    t.ok(res.statusCode)
    t.is(res.statusCode, 200)
    delete res.statusCode
    return res
  })

  function handler (req, res) {
    res.statusCode = 200
    var serialized = serializer(res)
    t.notOk(serialized.statusCode)
    res.end()
  }
})

test('res.headers is serialized', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    res.setHeader('x-custom', 'y')
    var serialized = serializers.resSerializer(res)
    t.is(serialized.headers['x-custom'], 'y')
    res.end()
  }
})
