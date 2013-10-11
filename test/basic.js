var assert = require('assert');
var readfile = require('fs').readFileSync;
var ex = module.exports;
var server = process.server;
var server2 = process.server2;

ex['trying to fetch non-existent package'] = function(cb) {
	server.get_package('testpkg', function(res, body) {
		// shouldn't exist yet
		assert.equal(res.statusCode, 404);
		assert(~body.error.indexOf('no such package'));
		cb();
	});
};

ex['creating new package'] = function(cb) {
	server.put_package('testpkg', require('./lib/package')('testpkg'), function(res, body) {
		assert.equal(res.statusCode, 201);
		assert(~body.ok.indexOf('created new package'));
		cb();
	});
};

ex['downloading non-existent tarball'] = function(cb) {
	server.get_tarball('testpkg', 'blahblah', function(res, body) {
		assert.equal(res.statusCode, 404);
		assert(~body.error.indexOf('no such file'));
		cb();
	});
};

ex['uploading incomplete tarball'] = function(cb) {
	server.put_tarball_incomplete('testpkg', 'blahblah1', readfile('fixtures/binary'), 3000, function(res, body) {
		cb();
	});
};

ex['uploading new tarball'] = function(cb) {
	server.put_tarball('testpkg', 'blahblah', readfile('fixtures/binary'), function(res, body) {
		assert.equal(res.statusCode, 201);
		assert(body.ok);
		cb();
	});
};

ex['doubleerr test'] = function(cb) {
	server.put_tarball('testfwd2', 'blahblah', readfile('fixtures/binary'), function(res, body) {
		assert.equal(res.statusCode, 404);
		assert(body.error);
		cb();
	});
};

ex['downloading newly created tarball'] = function(cb) {
	server.get_tarball('testpkg', 'blahblah', function(res, body) {
		assert.equal(res.statusCode, 200);
		assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'));
		cb();
	});
};

ex['uploading new package version'] = function(cb) {
	server.put_version('testpkg', '0.0.1', require('./lib/package')('testpkg'), function(res, body) {
		assert.equal(res.statusCode, 201);
		assert(~body.ok.indexOf('published'));
		cb();
	});
};

ex['downloading newly created package'] = function(cb) {
	server.get_package('testpkg', function(res, body) {
		assert.equal(res.statusCode, 200);
		assert.equal(body.name, 'testpkg');
		assert.equal(body.versions['0.0.1'].name, 'testpkg');
		assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55551/testpkg/-/blahblah');
		assert.deepEqual(body['dist-tags'], {latest: '0.0.1'});
		cb();
	});
};

ex['downloading package via server2'] = function(cb) {
	server2.get_package('testpkg', function(res, body) {
		assert.equal(res.statusCode, 200);
		assert.equal(body.name, 'testpkg');
		assert.equal(body.versions['0.0.1'].name, 'testpkg');
		assert.equal(body.versions['0.0.1'].dist.tarball, 'http://localhost:55552/testpkg/-/blahblah');
		assert.deepEqual(body['dist-tags'], {latest: '0.0.1'});
		cb();
	});
};
