'use strict'

var http = require('http')
var test = require('tap').test
var serializers = require('../lib/req')
var wrapRequestSerializer = require('../').wrapRequestSerializer

test('maps request', function (t) {
  t.plan(2)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    var serialized = serializers.mapHttpRequest(req)
    t.ok(serialized.req)
    t.ok(serialized.req.method)
    t.end()
    res.end()
  }
})

test('does not return excessively long object', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    var serialized = serializers.reqSerializer(req)
    t.is(Object.keys(serialized).length, 6)
    res.end()
  }
})

test('req.raw is available', function (t) {
  t.plan(2)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.foo = 'foo'
    var serialized = serializers.reqSerializer(req)
    t.ok(serialized.raw)
    t.is(serialized.raw.foo, 'foo')
    res.end()
  }
})

test('req.raw will be obtained in from input request raw property if input request raw property is truthy', function (t) {
  t.plan(2)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.raw = { req: {foo: 'foo'}, res: {} }
    var serialized = serializers.reqSerializer(req)
    t.ok(serialized.raw)
    t.is(serialized.raw.req.foo, 'foo')
    res.end()
  }
})

test('req.id defaults to undefined', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    var serialized = serializers.reqSerializer(req)
    t.is(serialized.id, undefined)
    res.end()
  }
})

test('req.id has a non-function value', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    var serialized = serializers.reqSerializer(req)
    t.is(typeof serialized.id === 'function', false)
    res.end()
  }
})

test('req.id will be obtained from input request info.id when input request id does not exist', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.info = {id: 'test'}
    var serialized = serializers.reqSerializer(req)
    t.is(serialized.id, 'test')
    res.end()
  }
})

test('req.id has a non-function value with custom id function', function (t) {
  t.plan(2)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.id = function () { return 42 }
    var serialized = serializers.reqSerializer(req)
    t.is(typeof serialized.id === 'function', false)
    t.is(serialized.id, 42)
    res.end()
  }
})

test('req.url will be obtained from input request url.path when input request url is an object', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.url = {path: '/test'}
    var serialized = serializers.reqSerializer(req)
    t.is(serialized.url, '/test')
    res.end()
  }
})

test('req.url will be obtained from input request originalUrl when available', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.originalUrl = '/test'
    var serialized = serializers.reqSerializer(req)
    t.is(serialized.url, '/test')
    res.end()
  }
})

test('can wrap request serializers', function (t) {
  t.plan(3)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  var serailizer = wrapRequestSerializer(function (req) {
    t.ok(req.method)
    t.is(req.method, 'GET')
    delete req.method
    return req
  })

  function handler (req, res) {
    var serialized = serailizer(req)
    t.notOk(serialized.method)
    res.end()
  }
})

test('req.remoteAddress will be obtained from request connect.remoteAddress as fallback', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.connection = {remoteAddress: 'http://localhost'}
    var serialized = serializers.reqSerializer(req)
    t.is(serialized.remoteAddress, 'http://localhost')
    res.end()
  }
})

test('req.remoteAddress will be obtained from request info.remoteAddress if available', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.info = {remoteAddress: 'http://localhost'}
    var serialized = serializers.reqSerializer(req)
    t.is(serialized.remoteAddress, 'http://localhost')
    res.end()
  }
})

test('req.remotePort will be obtained from request connect.remotePort as fallback', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.connection = {remotePort: 3000}
    var serialized = serializers.reqSerializer(req)
    t.is(serialized.remotePort, 3000)
    res.end()
  }
})

test('req.remotePort will be obtained from request info.remotePort if available', function (t) {
  t.plan(1)

  var server = http.createServer(handler)
  server.unref()
  server.listen(0, () => {
    http.get(server.address(), () => {})
  })

  t.tearDown(() => server.close())

  function handler (req, res) {
    req.info = {remotePort: 3000}
    var serialized = serializers.reqSerializer(req)
    t.is(serialized.remotePort, 3000)
    res.end()
  }
})
