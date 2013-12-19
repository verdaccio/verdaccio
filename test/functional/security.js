var assert = require('assert')
  , ex = module.exports
  , server = process.server
  , server2 = process.server2

module.exports = function() {
	describe('Security', function() {
		server.get_package('package.json', function(res, body) {
			assert.equal(res.statusCode, 403)
			assert(~body.error.indexOf('invalid package'))
			cb()
		})

		server.get_package('__proto__', function(res, body) {
			assert.equal(res.statusCode, 403)
			assert(~body.error.indexOf('invalid package'))
			cb()
		})

		it('__proto__, connect stuff', function(cb) {
			server.request({uri:'/testpkg?__proto__=1'}, function(err, res, body) {
				// test for NOT outputting stack trace
				assert(!body || typeof(body) === 'object' || body.indexOf('node_modules') === -1)

				// test for NOT crashing
				server.request({uri:'/testpkg'}, function(err, res, body) {
					assert.equal(res.statusCode, 200)
					cb()
				})
			})
		})

		it('do not return package.json as an attachment', function(cb) {
			server.request({uri:'/testpkg/-/package.json'}, function(err, res, body) {
				assert.equal(res.statusCode, 403)
				assert(body.error.match(/invalid filename/))
				cb()
			})
		})

		it('silly things - reading #1', function(cb) {
			server.request({uri:'/testpkg/-/../../../../../../../../etc/passwd'}, function(err, res, body) {
				assert.equal(res.statusCode, 404)
				cb()
			})
		})

		it('silly things - reading #2', function(cb) {
			server.request({uri:'/testpkg/-/%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'}, function(err, res, body) {
				assert.equal(res.statusCode, 403)
				assert(body.error.match(/invalid filename/))
				cb()
			})
		})

		it('silly things - writing #1', function(cb) {
			server.put_tarball('testpkg', 'package.json', '{}', function(res, body) {
				assert.equal(res.statusCode, 403)
				assert(body.error.match(/invalid filename/))
				cb()
			})
		})

		it('silly things - writing #3', function(cb) {
			server.put_tarball('testpkg', 'node_modules', '{}', function(res, body) {
				assert.equal(res.statusCode, 403)
				assert(body.error.match(/invalid filename/))
				cb()
			})
		})

		it('silly things - writing #4', function(cb) {
			server.put_tarball('testpkg', '../testpkg.tgz', '{}', function(res, body) {
				assert.equal(res.statusCode, 403)
				assert(body.error.match(/invalid filename/))
				cb()
			})
		})
	})
}

