require('./lib/startup')

var assert = require('assert')
var Promise = require('bluebird')

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function() {
  var server = process.server
  var express = process.express

  describe('testexp_gzip', function() {
    before(function() {
      express.get('/testexp_gzip', function(req, res) {
        var x = eval(
          '(' + readfile('fixtures/publish.json5')
            .toString('utf8')
            .replace(/__NAME__/g, 'testexp_gzip')
            .replace(/__VERSION__/g, '0.0.1')
          + ')'
        )

        // overcoming compress threshold
        x.versions['0.0.2'] = x.versions['0.0.1']
        x.versions['0.0.3'] = x.versions['0.0.1']
        x.versions['0.0.4'] = x.versions['0.0.1']
        x.versions['0.0.5'] = x.versions['0.0.1']
        x.versions['0.0.6'] = x.versions['0.0.1']
        x.versions['0.0.7'] = x.versions['0.0.1']
        x.versions['0.0.8'] = x.versions['0.0.1']
        x.versions['0.0.9'] = x.versions['0.0.1']

        require('zlib').gzip(JSON.stringify(x), function(err, buf) {
          assert.equal(err, null)
          assert.equal(req.headers['accept-encoding'], 'gzip')
          res.header('content-encoding', 'gzip')
          res.send(buf)
        })
      })

      express.get('/testexp_baddata', function(req, res) {
        assert.equal(req.headers['accept-encoding'], 'gzip')
        res.header('content-encoding', 'gzip')
        res.send(new Buffer([1,2,3,4,5,6,7,7,6,5,4,3,2,1]))
      })
    })

    it('should not fail on bad gzip', function () {
      return server.get_package('testexp_baddata')
               .status(404)
    })

    it('should understand gzipped data from uplink', function () {
      return server.get_package('testexp_gzip')
               .status(200)
               .response(function (res) {
                 assert.equal(res.headers['content-encoding'], undefined)
               })
               .then(function (body) {
                 assert.equal(body.name, 'testexp_gzip')
                 assert.equal(Object.keys(body.versions).length, 9)
               })
    })

    it('should serve gzipped data', function () {
      return server.request({
        uri: '/testexp_gzip',
        encoding: null,
        headers: {
          'Accept-encoding': 'gzip',
        },
        json: false,
      }).status(200)
        .response(function (res) {
          assert.equal(res.headers['content-encoding'], 'gzip')
        })
        .then(function (body) {
          assert.throws(function() {
            JSON.parse(body.toString('utf8'))
          })

          return new Promise(function (resolve) {
            require('zlib').gunzip(body, function(err, buf) {
              assert.equal(err, null)
              body = JSON.parse(buf)
              assert.equal(body.name, 'testexp_gzip')
              assert.equal(Object.keys(body.versions).length, 9)
              resolve()
            })
          })
        })
    })
  })
}

