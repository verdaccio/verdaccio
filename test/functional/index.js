require('es6-shim')
require('./lib/startup')

var assert = require('assert')
var async  = require('async')
var exec   = require('child_process').exec

describe('Func', function() {
  var server = process.server
  var server2 = process.server2

  before(function(cb) {
    async.parallel([
      function(cb) {
        require('./lib/startup').start('./test-storage', './config-1.yaml', cb)
      },
      function(cb) {
        require('./lib/startup').start('./test-storage2', './config-2.yaml', cb)
      },
    ], cb)
  })

  before(function(cb) {
    async.map([server, server2], function(server, cb) {
      server.debug(function(res, body) {
        server.pid = body.pid
        exec('lsof -p ' + Number(server.pid), function(err, result) {
          assert.equal(err, null)
          server.fdlist = result.replace(/ +/g, ' ')
          cb()
        })
      })
    }, cb)
  })

  before(function auth(cb) {
    async.map([server, server2], function(server, cb) {
      server.auth('test', 'test', function(res, body) {
        assert.equal(res.statusCode, 201)
        assert.notEqual(body.ok.indexOf("'test'"), -1)
        cb()
      })
    }, cb)
  })

  it('authenticate', function(){/* test for before() */})

  require('./basic')()
  require('./gh29')()
  require('./tags')()
  require('./gzip')()
  require('./incomplete')()
  require('./mirror')()
  require('./newnpmreg')()
  require('./nullstorage')()
  require('./race')()
  require('./racycrash')()
  require('./scoped')()
  require('./security')()
  require('./adduser')()
  require('./addtag')()

  after(function(cb) {
    async.map([server, server2], function(server, cb) {
      exec('lsof -p ' + Number(server.pid), function(err, result) {
        assert.equal(err, null)
        result = result.split('\n').filter(function(q) {
          if (q.match(/TCP .*->.* \(ESTABLISHED\)/)) return false
          if (q.match(/\/libcrypt-[^\/]+\.so/)) return false
          if (q.match(/\/node_modules\/crypt3\/build\/Release/)) return false
          return true
        }).join('\n').replace(/ +/g, ' ')

        assert.equal(server.fdlist, result)
        cb()
      })
    }, cb)
  })
})

