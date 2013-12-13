var assert = require('assert')
  , readfile = require('fs').readFileSync
  , ex = module.exports
  , server = process.server
  , server2 = process.server2

ex['downloading non-existent tarball #1 / srv2'] = function(cb) {
	server2.get_tarball('testpkg-gh29', 'blahblah', function(res, body) {
		assert.equal(res.statusCode, 404)
		assert(~body.error.indexOf('no such package'))
		cb()
	})
}

ex['creating new package / srv1'] = function(cb) {
	server.put_package('testpkg-gh29', require('./lib/package')('testpkg-gh29'), function(res, body) {
		assert.equal(res.statusCode, 201)
		assert(~body.ok.indexOf('created new package'))
		cb()
	})
}

ex['downloading non-existent tarball #2 / srv2'] = function(cb) {
	server2.get_tarball('testpkg-gh29', 'blahblah', function(res, body) {
		assert.equal(res.statusCode, 404)
		assert(~body.error.indexOf('no such file'))
		cb()
	})
}

ex['uploading new tarball / srv1'] = function(cb) {
	server.put_tarball('testpkg-gh29', 'blahblah', readfile('fixtures/binary'), function(res, body) {
		assert.equal(res.statusCode, 201)
		assert(body.ok)
		cb()
	})
}

ex['downloading newly created tarball / srv2'] = function(cb) {
	server2.get_tarball('testpkg-gh29', 'blahblah', function(res, body) {
		assert.equal(res.statusCode, 200)
		assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'))
		cb()
	})
}

