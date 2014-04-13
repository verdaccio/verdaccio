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

	describe('newnpmreg', function() {
		before(function(cb) {
			server.request({
				uri: '/testpkg-newnpmreg',
				headers: {
					'content-type': 'application/json',
				},
				method: 'PUT',
				json: JSON.parse(readfile('fixtures/newnpmreg.json')),
			}, function(err, res, body) {
				assert.equal(res.statusCode, 201)
				cb()
			})
		})

		it('add pkg', function(){})

		it('server1 - tarball', function(cb) {
			server.get_tarball('testpkg-newnpmreg', 'testpkg-newnpmreg-0.0.0.tgz', function(res, body) {
				assert.equal(res.statusCode, 200)
				// not real sha due to utf8 conversion
				assert.strictEqual(sha(body), '789ca61e3426ce55c4983451b58e62b04abceaf6')
				cb()
			})
		})

		it('server2 - tarball', function(cb) {
			server2.get_tarball('testpkg-newnpmreg', 'testpkg-newnpmreg-0.0.0.tgz', function(res, body) {
				assert.equal(res.statusCode, 200)
				// not real sha due to utf8 conversion
				assert.strictEqual(sha(body), '789ca61e3426ce55c4983451b58e62b04abceaf6')
				cb()
			})
		})

		it('server1 - package', function(cb) {
			server.get_package('testpkg-newnpmreg', function(res, body) {
				assert.equal(res.statusCode, 200)
				assert.equal(body.name, 'testpkg-newnpmreg')
				assert.equal(body.versions['0.0.0'].name, 'testpkg-newnpmreg')
				assert.equal(body.versions['0.0.0'].dist.tarball, 'http://localhost:55551/testpkg-newnpmreg/-/testpkg-newnpmreg-0.0.0.tgz')
				assert.deepEqual(body['dist-tags'], {foo: '0.0.0', latest: '0.0.0'})
				cb()
			})
		})

		it('server2 - package', function(cb) {
			server2.get_package('testpkg-newnpmreg', function(res, body) {
				assert.equal(res.statusCode, 200)
				assert.equal(body.name, 'testpkg-newnpmreg')
				assert.equal(body.versions['0.0.0'].name, 'testpkg-newnpmreg')
				assert.equal(body.versions['0.0.0'].dist.tarball, 'http://localhost:55552/testpkg-newnpmreg/-/testpkg-newnpmreg-0.0.0.tgz')
				assert.deepEqual(body['dist-tags'], {foo: '0.0.0', latest: '0.0.0'})
				cb()
			})
		})
	})
}
