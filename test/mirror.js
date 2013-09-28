var assert = require('assert');
var readfile = require('fs').readFileSync;
var ex = module.exports;
var server = process.server;
var server2 = process.server2;

ex['creating new package'] = function(cb) {
	server.put_package('testfwd', readfile('fixtures/fwd-package.json'), function(res, body) {
		assert.equal(res.statusCode, 201);
		assert(~body.ok.indexOf('created new package'));
		cb();
	});
};

ex['uploading new package version'] = function(cb) {
	server.put_version('testfwd', '0.1.1', readfile('fixtures/fwd-package.json'), function(res, body) {
		assert.equal(res.statusCode, 201);
		assert(~body.ok.indexOf('published'));
		cb();
	});
};

ex['downloading package via server2'] = function(cb) {
	server2.get_package('testfwd', function(res, body) {
		assert.equal(res.statusCode, 200);
		assert.equal(body.name, 'testfwd');
		assert.equal(body.versions['0.1.1'].name, 'testfwd');
		assert.equal(body.versions['0.1.1'].dist.tarball, 'http://localhost:55552/testpkg/-/blahblah');
		cb();
	});
};

ex['uploading incomplete tarball'] = function(cb) {
	server.put_tarball_incomplete('testfwd', 'testfwd.bad', readfile('fixtures/binary'), 3000, function(res, body) {
		cb();
	});
};

ex['uploading new tarball'] = function(cb) {
	server.put_tarball('testfwd', 'testfwd.file', readfile('fixtures/binary'), function(res, body) {
		assert.equal(res.statusCode, 201);
		assert(body.ok);
		cb();
	});
};

ex['downloading tarball from server2'] = function(cb) {
	server2.get_tarball('testfwd', 'testfwd.file', function(res, body) {
		assert.equal(res.statusCode, 200);
		assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'));
		cb();
	});
};

