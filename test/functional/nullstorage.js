require('./lib/startup')

var assert = require('assert')
  , async = require('async')
  , crypto = require('crypto')

function readfile(x) {
	return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function() {
	var server = process.server
	var server2 = process.server2

	it('trying to fetch non-existent package / null storage', function(cb) {
		server.get_package('test-nullstorage-nonexist', function(res, body) {
			assert.equal(res.statusCode, 404)
			assert(~body.error.indexOf('no such package'))
			cb()
		})
	})

	describe('test-nullstorage on server2', function() {
		before(server2.add_package.bind(server2, 'test-nullstorage2'))

		it('creating new package - server2', function(){/* test for before() */})

		it('downloading non-existent tarball', function(cb) {
			server.get_tarball('test-nullstorage2', 'blahblah', function(res, body) {
				assert.equal(res.statusCode, 404)
				assert(~body.error.indexOf('no such file'))
				cb()
			})
		})

		describe('tarball', function() {
			before(function(cb) {
				server2.put_tarball('test-nullstorage2', 'blahblah', readfile('fixtures/binary'), function(res, body) {
					assert.equal(res.statusCode, 201)
					assert(body.ok)
					cb()
				})
			})

			before(function(cb) {
				var pkg = require('./lib/package')('test-nullstorage2')
				pkg.dist.shasum = crypto.createHash('sha1').update(readfile('fixtures/binary')).digest('hex')
				server2.put_version('test-nullstorage2', '0.0.1', pkg, function(res, body) {
					assert.equal(res.statusCode, 201)
					assert(~body.ok.indexOf('published'))
					cb()
				})
			})

			it('uploading new tarball', function(){/* test for before() */})

			it('downloading newly created tarball', function(cb) {
				server.get_tarball('test-nullstorage2', 'blahblah', function(res, body) {
					assert.equal(res.statusCode, 200)
					assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'))
					cb()
				})
			})

			it('downloading newly created package', function(cb) {
				server.get_package('test-nullstorage2', function(res, body) {
					assert.equal(res.statusCode, 200)
					assert.equal(body.name, 'test-nullstorage2')
					assert.equal(body.versions['0.0.1'].name, 'test-nullstorage2')
					assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55551/test-nullstorage2/-/blahblah')
					assert.deepEqual(body['dist-tags'], {latest: '0.0.1'})
					cb()
				})
			})
		})
	})
}

