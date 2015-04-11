var assert   = require('assert')
var async    = require('async')
var _oksum   = 0

module.exports = function() {
  var server  = process.server

  describe('race', function() {
    before(function () {
      return server.put_package('race', require('./lib/package')('race'))
               .status(201)
               .body_ok(/created new package/)
    })

    it('creating new package', function(){})

    it('uploading 10 same versions', function (callback) {
      var fns = []
      for (var i=0; i<10; i++) {
        fns.push(function(cb_) {
          var data = require('./lib/package')('race')
          data.rand = Math.random()

          var _res
          server.put_version('race', '0.0.1', data)
            .response(function (res) { _res = res })
            .then(function (body) {
              cb_(null, [ _res, body ])
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

        callback()
      })
    })

    it('uploading 10 diff versions', function (callback) {
      var fns = []
      for (var i=0; i<10; i++) {
        ;(function(i) {
          fns.push(function(cb_) {
            var _res
            server.put_version('race', '0.1.'+String(i), require('./lib/package')('race'))
              .response(function (res) { _res = res })
              .then(function (body) {
                cb_(null, [ _res, body ])
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
        assert.notEqual(okcount, 1)
        _oksum += okcount

        callback()
      })
    })

    after('downloading package', function () {
      return server.get_package('race')
               .status(200)
               .then(function (body) {
                 assert.equal(Object.keys(body.versions).length, _oksum)
               })
    })
  })
}

