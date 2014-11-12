var assert = require('assert')
var crypto = require('crypto')

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function() {
  var server = process.server
  var server2 = process.server2

  it('downloading non-existent tarball #1 / srv2', function(cb) {
    server2.get_tarball('testpkg-gh29', 'blahblah', function(res, body) {
      assert.equal(res.statusCode, 404)
      assert(~body.error.indexOf('no such package'))
      cb()
    })
  })

  describe('pkg-gh29', function() {
    before(function(cb) {
      server.put_package('testpkg-gh29', require('./lib/package')('testpkg-gh29'), function(res, body) {
        assert.equal(res.statusCode, 201)
        assert(~body.ok.indexOf('created new package'))
        cb()
      })
    })

    it('creating new package / srv1', function(){})

    it('downloading non-existent tarball #2 / srv2', function(cb) {
      server2.get_tarball('testpkg-gh29', 'blahblah', function(res, body) {
        assert.equal(res.statusCode, 404)
        assert(~body.error.indexOf('no such file'))
        cb()
      })
    })

    describe('tarball', function() {
      before(function(cb) {
        server.put_tarball('testpkg-gh29', 'blahblah', readfile('fixtures/binary'), function(res, body) {
          assert.equal(res.statusCode, 201)
          assert(body.ok)
          cb()
        })
      })

      it('uploading new tarball / srv1', function(){})

      describe('pkg version', function() {
        before(function(cb) {
          var pkg = require('./lib/package')('testpkg-gh29')
          pkg.dist.shasum = crypto.createHash('sha1').update(readfile('fixtures/binary')).digest('hex')
          server.put_version('testpkg-gh29', '0.0.1', pkg, function(res, body) {
            assert.equal(res.statusCode, 201)
            assert(~body.ok.indexOf('published'))
            cb()
          })
        })

        it('uploading new package version / srv1', function(){})

        it('downloading newly created tarball / srv2', function(cb) {
          server2.get_tarball('testpkg-gh29', 'blahblah', function(res, body) {
            assert.equal(res.statusCode, 200)
            assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'))
            cb()
          })
        })
      })
    })
  })
}

