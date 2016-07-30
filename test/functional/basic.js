require('./lib/startup')

var assert = require('assert')
var crypto = require('crypto')

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function () {
  var server = process.server
  var server2 = process.server2

  it('trying to fetch non-existent package', function () {
    return server.get_package('testpkg').status(404).body_error(/no such package/)
  })

  describe('testpkg', function () {
    before(function () {
      return server.add_package('testpkg')
    })

    it('creating new package', function (){/* test for before() */})

    it('downloading non-existent tarball', function () {
      return server.get_tarball('testpkg', 'blahblah').status(404).body_error(/no such file/)
    })

    it('uploading incomplete tarball', function () {
      return server.put_tarball_incomplete('testpkg', 'blahblah1', readfile('fixtures/binary'), 3000)
    })

    describe('tarball', function () {
      before(function () {
        return server.put_tarball('testpkg', 'blahblah', readfile('fixtures/binary'))
                 .status(201)
                 .body_ok(/.*/)
      })

      it('uploading new tarball', function (){/* test for before() */})

      it('downloading newly created tarball', function () {
        return server.get_tarball('testpkg', 'blahblah')
                 .status(200)
                 .then(function (body) {
                   assert.deepEqual(body, readfile('fixtures/binary'))
                 })
      })

      it('uploading new package version (bad sha)', function () {
        var pkg = require('./lib/package')('testpkg')
        pkg.dist.shasum = crypto.createHash('sha1').update('fake').digest('hex')

        return server.put_version('testpkg', '0.0.1', pkg)
                 .status(400)
                 .body_error(/shasum error/)
      })

      describe('version', function () {
        before(function () {
          var pkg = require('./lib/package')('testpkg')
          pkg.dist.shasum = crypto.createHash('sha1').update(readfile('fixtures/binary')).digest('hex')
          return server.put_version('testpkg', '0.0.1', pkg)
                   .status(201)
                   .body_ok(/published/)
        })

        it('uploading new package version', function (){/* test for before() */})

        it('downloading newly created package', function () {
          return server.get_package('testpkg')
                   .status(200)
                   .then(function (body) {
                     assert.equal(body.name, 'testpkg')
                     assert.equal(body.versions['0.0.1'].name, 'testpkg')
                     assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55551/testpkg/-/blahblah')
                     assert.deepEqual(body['dist-tags'], {latest: '0.0.1'})
                   })
        })

        it('downloading package via server2', function () {
          return server2.get_package('testpkg')
                   .status(200)
                   .then(function (body) {
                     assert.equal(body.name, 'testpkg')
                     assert.equal(body.versions['0.0.1'].name, 'testpkg')
                     assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55552/testpkg/-/blahblah')
                     assert.deepEqual(body['dist-tags'], {latest: '0.0.1'})
                   })
        })
      })
    })
  })

  it('uploading new package version for bad pkg', function () {
    return server.put_version('testpxg', '0.0.1', require('./lib/package')('testpxg'))
             .status(404)
             .body_error(/no such package/)
  })

  it('doubleerr test', function () {
    return server.put_tarball('testfwd2', 'blahblah', readfile('fixtures/binary'))
             .status(404)
             .body_error(/no such/)
  })

  it('publishing package / bad ro uplink', function () {
    return server.put_package('baduplink', require('./lib/package')('baduplink'))
             .status(503)
             .body_error(/one of the uplinks is down, refuse to publish/)
  })

  it('who am I?', function () {
    return server.whoami().then(function (username) {
      assert.equal(username, 'test')
    })
  })
}

