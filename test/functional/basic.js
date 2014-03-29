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

	it('trying to fetch non-existent package', function(cb) {
		server.get_package('testpkg', function(res, body) {
			assert.equal(res.statusCode, 404)
			assert(~body.error.indexOf('no such package'))
			cb()
		})
	})

	describe('testpkg', function() {
		before(server.add_package.bind(server, 'testpkg'))

		it('creating new package', function(){/* test for before() */})

		it('downloading non-existent tarball', function(cb) {
			server.get_tarball('testpkg', 'blahblah', function(res, body) {
				assert.equal(res.statusCode, 404)
				assert(~body.error.indexOf('no such file'))
				cb()
			})
		})

		it('uploading incomplete tarball', function(cb) {
			server.put_tarball_incomplete('testpkg', 'blahblah1', readfile('fixtures/binary'), 3000, function(res, body) {
				cb()
			})
		})

		describe('tarball', function() {
			before(function(cb) {
				server.put_tarball('testpkg', 'blahblah', readfile('fixtures/binary'), function(res, body) {
					assert.equal(res.statusCode, 201)
					assert(body.ok)
					cb()
				})
			})

			it('uploading new tarball', function(){/* test for before() */})

			it('downloading newly created tarball', function(cb) {
				server.get_tarball('testpkg', 'blahblah', function(res, body) {
					assert.equal(res.statusCode, 200)
					assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'))
					cb()
				})
			})

			it('uploading new package version (bad sha)', function(cb) {
				var pkg = require('./lib/package')('testpkg')
				pkg.dist.shasum = crypto.createHash('sha1').update('fake').digest('hex')
				server.put_version('testpkg', '0.0.1', pkg, function(res, body) {
					assert.equal(res.statusCode, 400)
					assert(~body.error.indexOf('shasum error'))
					cb()
				})
			})

			describe('version', function() {
				before(function(cb) {
					var pkg = require('./lib/package')('testpkg')
					pkg.dist.shasum = crypto.createHash('sha1').update(readfile('fixtures/binary')).digest('hex')
					server.put_version('testpkg', '0.0.1', pkg, function(res, body) {
						assert.equal(res.statusCode, 201)
						assert(~body.ok.indexOf('published'))
						cb()
					})
				})

				it('uploading new package version', function(){/* test for before() */})

				it('downloading newly created package', function(cb) {
					server.get_package('testpkg', function(res, body) {
						assert.equal(res.statusCode, 200)
						assert.equal(body.name, 'testpkg')
						assert.equal(body.versions['0.0.1'].name, 'testpkg')
						assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55551/testpkg/-/blahblah')
						assert.deepEqual(body['dist-tags'], {latest: '0.0.1'})
						cb()
					})
				})

				it('downloading package via server2', function(cb) {
					server2.get_package('testpkg', function(res, body) {
						assert.equal(res.statusCode, 200)
						assert.equal(body.name, 'testpkg')
						assert.equal(body.versions['0.0.1'].name, 'testpkg')
						assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55552/testpkg/-/blahblah')
						assert.deepEqual(body['dist-tags'], {latest: '0.0.1'})
						cb()
					})
				})
			})
		})
	})

	it('uploading new package version for bad pkg', function(cb) {
		server.put_version('testpxg', '0.0.1', require('./lib/package')('testpxg'), function(res, body) {
			assert.equal(res.statusCode, 404)
			assert(~body.error.indexOf('no such package'))
			cb()
		})
	})

	it('doubleerr test', function(cb) {
		server.put_tarball('testfwd2', 'blahblah', readfile('fixtures/binary'), function(res, body) {
			assert.equal(res.statusCode, 404)
			assert(body.error)
			cb()
		})
	})

	it('publishing package / bad ro uplink', function(cb) {
		server.put_package('baduplink', require('./lib/package')('baduplink'), function(res, body) {
			assert.equal(res.statusCode, 503)
			assert(~body.error.indexOf('one of the uplinks is down, refuse to publish'))
			cb()
		})
	})
}

