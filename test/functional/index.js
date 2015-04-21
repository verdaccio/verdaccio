//require('es6-shim')
require('./lib/startup')
var Promise = require('bluebird')

var assert = require('assert')
var async  = require('async')
var exec   = require('child_process').exec

describe('Func', function() {
  var server = process.server
  var server2 = process.server2

  before(function (cb) {
    async.parallel([
      function (cb) {
        require('./lib/startup').start('./test-storage', './config-1.yaml', cb)
      },
      function (cb) {
        require('./lib/startup').start('./test-storage2', './config-2.yaml', cb)
      },
    ], cb)
  })

  before(function() {
    return Promise.all([ server, server2 ].map(function(server) {
      return server.debug().status(200).then(function (body) {
        server.pid = body.pid

        return new Promise(function (resolve, reject) {
          exec('lsof -p ' + Number(server.pid), function(err, result) {
            assert.equal(err, null)
            server.fdlist = result.replace(/ +/g, ' ')
            resolve()
          })
        })
      })
    }))
  })

  before(function auth() {
    return Promise.all([ server, server2 ].map(function(server, cb) {
      return server.auth('test', 'test').status(201).body_ok(/'test'/)
    }))
  })

  it('authenticate', function(){/* test for before() */})

  require('./access')()
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
  require('./plugins')()

  after(function (cb) {
    async.map([ server, server2 ], function(server, cb) {
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

process.on('unhandledRejection', function (err) {
  process.nextTick(function () {
    throw err
  })
})

