var assert = require('assert')

module.exports = function() {
  var server  = process.server

  describe('Security', function() {
    before(function() {
      return server.add_package('testpkg-sec')
    })

    it('bad pkg #1', function () {
      return server.get_package('package.json')
               .status(403)
               .body_error(/invalid package/)
    })

    it('bad pkg #2', function () {
      return server.get_package('__proto__')
               .status(403)
               .body_error(/invalid package/)
    })

    it('__proto__, connect stuff', function () {
      return server.request({ uri: '/testpkg-sec?__proto__=1' })
        .then(function (body) {
          // test for NOT outputting stack trace
          assert(!body || typeof(body) === 'object' || body.indexOf('node_modules') === -1)

          // test for NOT crashing
          return server.request({ uri: '/testpkg-sec' }).status(200)
        })
    })

    it('do not return package.json as an attachment', function () {
      return server.request({ uri: '/testpkg-sec/-/package.json' })
               .status(403)
               .body_error(/invalid filename/)
    })

    it('silly things - reading #1', function () {
      return server.request({ uri: '/testpkg-sec/-/../../../../../../../../etc/passwd' })
               .status(404)
    })

    it('silly things - reading #2', function () {
      return server.request({ uri: '/testpkg-sec/-/%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd' })
               .status(403)
               .body_error(/invalid filename/)
    })

    it('silly things - writing #1', function () {
      return server.put_tarball('testpkg-sec', 'package.json', '{}')
               .status(403)
               .body_error(/invalid filename/)
    })

    it('silly things - writing #3', function () {
      return server.put_tarball('testpkg-sec', 'node_modules', '{}')
               .status(403)
               .body_error(/invalid filename/)
    })

    it('silly things - writing #4', function () {
      return server.put_tarball('testpkg-sec', '../testpkg.tgz', '{}')
               .status(403)
               .body_error(/invalid filename/)
    })
  })
}

