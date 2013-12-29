var assert = require('assert')
  , ex = module.exports

function readfile(x) {
	return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function() {
	var server = process.server
	var server2 = process.server2

	it('testing anti-loop', function(cb) {
		server2.get_package('testloop', function(res, body) {
			assert.equal(res.statusCode, 404)
			assert(~body.error.indexOf('no such package'))
			cb()
		})
	})

	;['fwd', /*'loop'*/].forEach(function(pkg) {
		var prefix = pkg + ': '
		pkg = 'test' + pkg

		describe(pkg, function() {
			before(function(cb) {
				server.put_package(pkg, require('./lib/package')(pkg), function(res, body) {
					assert.equal(res.statusCode, 201)
					assert(~body.ok.indexOf('created new package'))
					cb()
				})
			})

			it(prefix+'creating new package', function(){})

			describe(pkg, function() {
				before(function(cb) {
					server.put_version(pkg, '0.1.1', require('./lib/package')(pkg), function(res, body) {
						assert.equal(res.statusCode, 201)
						assert(~body.ok.indexOf('published'))
						cb()
					})
				})

				it(prefix+'uploading new package version', function(){})

				it(prefix+'uploading incomplete tarball', function(cb) {
					server.put_tarball_incomplete(pkg, pkg+'.bad', readfile('fixtures/binary'), 3000, function(res, body) {
						cb()
					})
				})

				describe('tarball', function() {
					before(function(cb) {
						server.put_tarball(pkg, pkg+'.file', readfile('fixtures/binary'), function(res, body) {
							assert.equal(res.statusCode, 201)
							assert(body.ok)
							cb()
						})
					})

					it(prefix+'uploading new tarball', function(){})

					it(prefix+'downloading tarball from server1', function(cb) {
						server.get_tarball(pkg, pkg+'.file', function(res, body) {
							assert.equal(res.statusCode, 200)
							assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'))
							cb()
						})
					})
				})
			})
		})
	})
}

