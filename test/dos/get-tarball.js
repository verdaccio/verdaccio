#!/usr/bin/env node

var async = require('async');
var assert = require('assert');
var Server = require('../lib/server');
var readfile = require('fs').readFileSync;
var binary = readfile('../fixtures/binary');
var count = 10000;

var server = new Server('http://localhost:55551/');
async.series([
	function(cb) {
		server.auth('test', 'test', function(res, body) {
			cb();
		});
	},
	function(cb) {
		server.put_package('testpkg', readfile('../fixtures/test-package.json'), function(res, body) {
			cb();
		});
	},
	function(cb) {
		server.put_tarball('testpkg', 'blahblah', binary, function(res, body) {
			cb();
		});
	},
	function dos(cb) {
		server.get_tarball('testpkg', 'blahblah', function(res, body) {
			assert(res.statusCode === 200);
			assert.deepEqual(body, binary.toString('utf8'));
			if (count-- > 0) {
				dos(cb);
			} else {
				cb();
			}
		});
	},
], function() {
	process.exit();
});

