var assert = require('assert')

module.exports = function() {
  var server  = process.server

  describe('Security', function() {
    before(server.add_package.bind(server, 'testpkg-sec'))

    it('bad pkg #1', function(cb) {
      server.get_package('package.json', function(res, body) {
        assert.equal(res.statusCode, 403)
        assert(~body.error.indexOf('invalid package'))
        cb()
      })
    })

    it('bad pkg #2', function(cb) {
      server.get_package('__proto__', function(res, body) {
        assert.equal(res.statusCode, 403)
        assert(~body.error.indexOf('invalid package'))
        cb()
      })
    })

    it('__proto__, connect stuff', function(cb) {
      server.request({uri:'/testpkg-sec?__proto__=1'}, function(err, res, body) {
        assert.equal(err, null)

        // test for NOT outputting stack trace
        assert(!body || typeof(body) === 'object' || body.indexOf('node_modules') === -1)

        // test for NOT crashing
        server.request({uri:'/testpkg-sec'}, function(err, res, body) {
          assert.equal(err, null)
          assert.equal(res.statusCode, 200)
          cb()
        })
      })
    })

    it('do not return package.json as an attachment', function(cb) {
      server.request({uri:'/testpkg-sec/-/package.json'}, function(err, res, body) {
        assert.equal(err, null)
        assert.equal(res.statusCode, 403)
        assert(body.error.match(/invalid filename/))
        cb()
      })
    })

    it('silly things - reading #1', function(cb) {
      server.request({uri:'/testpkg-sec/-/../../../../../../../../etc/passwd'}, function(err, res, body) {
        assert.equal(err, null)
        assert.equal(res.statusCode, 404)
        cb()
      })
    })

    it('silly things - reading #2', function(cb) {
      server.request({uri:'/testpkg-sec/-/%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'}, function(err, res, body) {
        assert.equal(err, null)
        assert.equal(res.statusCode, 403)
        assert(body.error.match(/invalid filename/))
        cb()
      })
    })

    it('silly things - writing #1', function(cb) {
      server.put_tarball('testpkg-sec', 'package.json', '{}', function(res, body) {
        assert.equal(res.statusCode, 403)
        assert(body.error.match(/invalid filename/))
        cb()
      })
    })

    it('silly things - writing #3', function(cb) {
      server.put_tarball('testpkg-sec', 'node_modules', '{}', function(res, body) {
        assert.equal(res.statusCode, 403)
        assert(body.error.match(/invalid filename/))
        cb()
      })
    })

    it('silly things - writing #4', function(cb) {
      server.put_tarball('testpkg-sec', '../testpkg.tgz', '{}', function(res, body) {
        assert.equal(res.statusCode, 403)
        assert(body.error.match(/invalid filename/))
        cb()
      })
    })
  })
}

