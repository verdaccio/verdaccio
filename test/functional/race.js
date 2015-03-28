var assert   = require('assert')
var async    = require('async')
var _oksum   = 0

module.exports = function() {
  var server  = process.server

  describe('race', function() {
    before(function(cb) {
      server.put_package('race', require('./lib/package')('race'), function(res, body) {
        assert.equal(res.statusCode, 201)
        assert(~body.ok.indexOf('created new package'))
        cb()
      })
    })

    it('creating new package', function(){})

    it('uploading 10 same versions', function(cb) {
      var fns = []
      for (var i=0; i<10; i++) {
        fns.push(function(cb_) {
          var data = require('./lib/package')('race')
          data.rand = Math.random()
          server.put_version('race', '0.0.1', data, function(res, body) {
            cb_(null, res, body)
          })
        })
      }

      async.parallel(fns, function(err, res) {
        var okcount = 0
        var failcount = 0

        assert.equal(err, null)

        res.forEach(function(arr) {
          var resp = arr[0]
          var body = arr[1]

          if (resp.statusCode === 201 && ~body.ok.indexOf('published')) okcount++
          if (resp.statusCode === 409 && ~body.error.indexOf('already present')) failcount++
          if (resp.statusCode === 503 && ~body.error.indexOf('unavailable')) failcount++
        })
        assert.equal(okcount + failcount, 10)
        assert.equal(okcount, 1)
        _oksum += okcount

        cb()
      })
    })

    it('uploading 10 diff versions', function(cb) {
      var fns = []
      for (var i=0; i<10; i++) {
        ;(function(i) {
          fns.push(function(cb_) {
            server.put_version('race', '0.1.'+String(i), require('./lib/package')('race'), function(res, body) {
              cb_(null, res, body)
            })
          })
        })(i)
      }

      async.parallel(fns, function(err, res) {
        var okcount = 0
        var failcount = 0

        assert.equal(err, null)
        res.forEach(function(arr) {
          var resp = arr[0]
          var body = arr[1]
          if (resp.statusCode === 201 && ~body.ok.indexOf('published')) okcount++
          if (resp.statusCode === 409 && ~body.error.indexOf('already present')) failcount++
          if (resp.statusCode === 503 && ~body.error.indexOf('unavailable')) failcount++
        })
        assert.equal(okcount + failcount, 10)
        _oksum += okcount

        cb()
      })
    })

    // XXX: this should be after anything else, but we can't really ensure that with mocha
    it('downloading package', function(cb) {
      server.get_package('race', function(res, body) {
        assert.equal(res.statusCode, 200)
        assert.equal(Object.keys(body.versions).length, _oksum)
        cb()
      })
    })
  })
}

