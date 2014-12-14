var assert = require('assert')

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

function sha(x) {
  return require('crypto').createHash('sha1', 'binary').update(x).digest('hex')
}

module.exports = function() {
  var server = process.server
  var server2 = process.server2
  var express = process.express

  describe('test-scoped', function() {
    before(function(cb) {
      server.request({
        uri: '/@test%2fscoped',
        headers: {
          'content-type': 'application/json',
        },
        method: 'PUT',
        json: JSON.parse(readfile('fixtures/scoped.json')),
      }, function(err, res, body) {
        assert.equal(res.statusCode, 201)
        cb()
      })
    })

    it('add pkg', function(){})

    it('server1 - tarball', function(cb) {
      server.get_tarball('@test/scoped', 'scoped-1.0.0.tgz', function(res, body) {
        assert.equal(res.statusCode, 200)
        // not real sha due to utf8 conversion
        assert.strictEqual(sha(body), 'c59298948907d077c3b42f091554bdeea9208964')
        cb()
      })
    })

    it('server2 - tarball', function(cb) {
      server2.get_tarball('@test/scoped', 'scoped-1.0.0.tgz', function(res, body) {
        assert.equal(res.statusCode, 200)
        // not real sha due to utf8 conversion
        assert.strictEqual(sha(body), 'c59298948907d077c3b42f091554bdeea9208964')
        cb()
      })
    })

    it('server1 - package', function(cb) {
      server.get_package('@test/scoped', function(res, body) {
        assert.equal(res.statusCode, 200)
        assert.equal(body.name, '@test/scoped')
        assert.equal(body.versions['1.0.0'].name, '@test/scoped')
        assert.equal(body.versions['1.0.0'].dist.tarball, 'http://localhost:55551/@test%2fscoped/-/scoped-1.0.0.tgz')
        assert.deepEqual(body['dist-tags'], {latest: '1.0.0'})
        cb()
      })
    })

    it('server2 - package', function(cb) {
      server2.get_package('@test/scoped', function(res, body) {
        assert.equal(res.statusCode, 200)
        assert.equal(body.name, '@test/scoped')
        assert.equal(body.versions['1.0.0'].name, '@test/scoped')
        assert.equal(body.versions['1.0.0'].dist.tarball, 'http://localhost:55552/@test%2fscoped/-/scoped-1.0.0.tgz')
        assert.deepEqual(body['dist-tags'], {latest: '1.0.0'})
        cb()
      })
    })
  })
}
