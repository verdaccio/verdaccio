var assert = require('assert')
var crypto = require('crypto')

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function() {
  var server = process.server
  var server2 = process.server2

  it('downloading non-existent tarball #1 / srv2', function () {
    return server2.get_tarball('testpkg-gh29', 'blahblah')
             .status(404)
             .body_error(/no such package/)
  })

  describe('pkg-gh29', function() {
    before(function () {
      return server.put_package('testpkg-gh29', require('./lib/package')('testpkg-gh29'))
               .status(201)
               .body_ok(/created new package/)
    })

    it('creating new package / srv1', function(){})

    it('downloading non-existent tarball #2 / srv2', function () {
      return server2.get_tarball('testpkg-gh29', 'blahblah')
               .status(404)
               .body_error(/no such file/)
    })

    describe('tarball', function() {
      before(function () {
        return server.put_tarball('testpkg-gh29', 'blahblah', readfile('fixtures/binary'))
                 .status(201)
                 .body_ok(/.*/)
      })

      it('uploading new tarball / srv1', function(){})

      describe('pkg version', function() {
        before(function () {
          var pkg = require('./lib/package')('testpkg-gh29')
          pkg.dist.shasum = crypto.createHash('sha1').update(readfile('fixtures/binary')).digest('hex')
          return server.put_version('testpkg-gh29', '0.0.1', pkg)
                   .status(201)
                   .body_ok(/published/)
        })

        it('uploading new package version / srv1', function(){})

        it('downloading newly created tarball / srv2', function () {
          return server2.get_tarball('testpkg-gh29', 'blahblah')
                   .status(200)
                   .then(function (body) {
                     assert.deepEqual(body, readfile('fixtures/binary'))
                   })
        })
      })
    })
  })
}

