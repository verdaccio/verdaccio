var assert = require('assert')

module.exports = function() {
  var server = process.server
  var express = process.express

  describe('Incomplete', function() {
    before(function() {
      express.get('/testexp-incomplete', function(_, res) {
        res.send({
          "name": "testexp-incomplete",
          "versions": {
            "0.1.0": {
              "name": "testexp_tags",
              "version": "0.1.0",
              "dist": {
                "shasum": "fake",
                "tarball": "http://localhost:55550/testexp-incomplete/-/content-length.tar.gz"
              }
            },
            "0.1.1": {
              "name": "testexp_tags",
              "version": "0.1.1",
              "dist": {
                "shasum": "fake",
                "tarball": "http://localhost:55550/testexp-incomplete/-/chunked.tar.gz"
              }
            }
          }
        })
      })
    })

    ;[ 'content-length', 'chunked' ].forEach(function(type) {
      it('should not store tarballs / ' + type, function(_cb) {
        var called
        express.get('/testexp-incomplete/-/'+type+'.tar.gz', function(_, res) {
          if (called) return res.socket.destroy()
          called = true
          if (type !== 'chunked') res.header('content-length', 1e6)
          res.write('test test test\n')
          setTimeout(function() {
            res.socket.write('200\nsss\n')
            res.socket.destroy()
            cb()
          }, 10)
        })

        server.request({ uri: '/testexp-incomplete/-/'+type+'.tar.gz' })
          .status(200)
          .response(function (res) {
            if (type !== 'chunked') assert.equal(res.headers['content-length'], 1e6)
          })
          .then(function (body) {
             assert(body.match(/test test test/))
          })

        function cb() {
          server.request({ uri: '/testexp-incomplete/-/'+type+'.tar.gz' })
            .body_error('internal server error')
            .then(function () { _cb() })
        }
      })
    })
  })
}

