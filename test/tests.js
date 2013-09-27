var fs = require('fs');
var async = require('async');
var assert = require('assert');
var rimraf = require('rimraf');
var Server = require('./lib/server');
var fork = require('child_process').fork;
var readfile = require('fs').readFileSync;
var forks = [];
var ex = module.exports;

var server = new Server('http://localhost:55551/');
var server2 = new Server('http://localhost:55552/');

ex['starting servers'] = function(cb) {
	var count = 0;
	function start(dir, conf) {
		count++;
		rimraf(dir, function() {
			var f = fork('../bin/sinopia', ['-c', conf], {silent: true});
			forks.push(f);
			f.on('message', function(msg) {
				if ('sinopia_started' in msg) {
					if (!--count) cb();
				}
			});
		});
	};

	start('./test-storage', './config-1.yaml', cb);
	start('./test-storage2', './config-2.yaml', cb);
};

ex['authentication to server1'] = function(cb) {
	server.auth('test', 'test', function(res, body) {
		assert(res.statusCode === 201);
		assert.notEqual(body.ok.indexOf('"test"'), -1);
		cb();
	});
},

ex['trying to fetch non-existent package'] = function(cb) {
	server.get_package('testpkg', function(res, body) {
		// shouldn't exist yet
		assert(res.statusCode === 404);
		assert(~body.error.indexOf('no such package'));
		cb();
	});
};

ex['creating new package'] = function(cb) {
	server.put_package('testpkg', readfile('fixtures/test-package.json'), function(res, body) {
		assert(res.statusCode === 201);
		assert(~body.ok.indexOf('created new package'));
		cb();
	});
};

ex['downloading newly created package'] = function(cb) {
	server.get_package('testpkg', function(res, body) {
		assert(res.statusCode === 200);
		assert(body.name === 'testpkg');
		cb();
	});
};

ex['downloading non-existent tarball'] = function(cb) {
	server.get_tarball('testpkg', 'blahblah', function(res, body) {
		assert(res.statusCode === 404);
		assert(~body.error.indexOf('no such file'));
		cb();
	});
};

ex['uploading new tarball'] = function(cb) {
	server.put_tarball('testpkg', 'blahblah', readfile('fixtures/binary'), function(res, body) {
		assert(res.statusCode === 201);
		assert(body.ok);
		cb();
	});
};

ex['downloading newly created tarball'] = function(cb) {
	server.get_tarball('testpkg', 'blahblah', function(res, body) {
		assert(res.statusCode === 200);
		assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'));
		cb();
	});
};

process.on('exit', function() {
	if (forks[0]) forks[0].kill();
	if (forks[1]) forks[1].kill();
});

