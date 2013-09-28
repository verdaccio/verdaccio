var assert = require('assert');
var readfile = require('fs').readFileSync;
var ex = module.exports;
var server = process.server;
var server2 = process.server2;

['fwd', 'loop'].forEach(function(pkg) {
	var prefix = pkg+': ';
	pkg = 'test'+pkg;

	ex[prefix+'creating new package'] = function(cb) {
		server.put_package(pkg, require('./lib/package')(pkg), function(res, body) {
			assert.equal(res.statusCode, 201);
			assert(~body.ok.indexOf('created new package'));
			cb();
		});
	};

	ex[prefix+'uploading new package version'] = function(cb) {
		server.put_version(pkg, '0.1.1', require('./lib/package')(pkg), function(res, body) {
			assert.equal(res.statusCode, 201);
			assert(~body.ok.indexOf('published'));
			cb();
		});
	};

	ex[prefix+'downloading package via server2'] = function(cb) {
		server2.get_package(pkg, function(res, body) {
			assert.equal(res.statusCode, 200);
			assert.equal(body.name, pkg);
			assert.equal(body.versions['0.1.1'].name, pkg);
			assert.equal(body.versions['0.1.1'].dist.tarball, 'http://localhost:55552/'+pkg+'/-/blahblah');
			cb();
		});
	};

	ex[prefix+'uploading incomplete tarball'] = function(cb) {
		server.put_tarball_incomplete(pkg, pkg+'.bad', readfile('fixtures/binary'), 3000, function(res, body) {
			cb();
		});
	};

	ex[prefix+'uploading new tarball'] = function(cb) {
		server.put_tarball(pkg, pkg+'.file', readfile('fixtures/binary'), function(res, body) {
			assert.equal(res.statusCode, 201);
			assert(body.ok);
			cb();
		});
	};

	ex[prefix+'downloading tarball from server1'] = function(cb) {
		server.get_tarball(pkg, pkg+'.file', function(res, body) {
			assert.equal(res.statusCode, 200);
			assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'));
			cb();
		});
	};

	ex[prefix+'downloading tarball from server2'] = function(cb) {
		server2.get_tarball(pkg, pkg+'.file', function(res, body) {
			assert.equal(res.statusCode, 200);
			assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'));
			cb();
		});
	};
});

