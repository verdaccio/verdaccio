var assert  = require('assert')
var express = require('express')
var request = require('request')
var rimraf  = require('rimraf')
var sinopia = require('../../')

var config = {
  storage: __dirname + '/test-storage',
  packages: {
    '*': {
      allow_access: '$all',
    },
  },
  logs: [
    {type: 'stdout', format: 'pretty', level: 'fatal'}
  ],
}

describe('toplevel', function() {
  var port

  before(function(done) {
    rimraf(__dirname + '/test-storage', done)
  })

  before(function(done) {
    var app = express()
    app.use(sinopia(config))

    var server = require('http').createServer(app)
    server.listen(0, function() {
      port = server.address().port
      done()
    })
  })

  it('should respond on /', function(done) {
    request({
      url: 'http://localhost:' + port + '/',
    }, function(err, res, body) {
      assert.equal(err, null)
      assert(body.match(/<title>Verdaccio<\/title>/))
      done()
    })
  })

  it('should respond on /whatever', function(done) {
    request({
      url: 'http://localhost:' + port + '/whatever',
    }, function(err, res, body) {
      assert.equal(err, null)
      assert(body.match(/no such package available/))
      done()
    })
  })
})
