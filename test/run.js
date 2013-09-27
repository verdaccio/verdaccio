#!/usr/bin/env node

var async = require('async');
var assert = require('assert');
var rimraf = require('rimraf');
var Server = require('./lib/server');
var readfile = require('fs').readFileSync;

var server = new Server('http://localhost:55550/');
async.series([
	function(cb) {
		rimraf('./test-storage', cb);
	},
	function(cb) {
		process.argv = ['node', 'sinopia', '-c', './config.yaml'];
		require('../bin/sinopia');
		cb();
	},
	function(cb) {
		setTimeout(cb, 1000);
	},
	function(cb) {
		server.auth('test', 'test', function(res, body) {
			assert(res.statusCode === 201);
			assert.notEqual(body.ok.indexOf('"test"'), -1);
			cb();
		});
	},
	function(cb) {
		server.get_package('testpkg', function(res, body) {
			// shouldn't exist yet
			assert(res.statusCode === 404);
			assert(~body.error.indexOf('no such package'));
			cb();
		});
	},
	function(cb) {
		server.put_package('testpkg', readfile('fixtures/test-package.json'), function(res, body) {
			assert(res.statusCode === 201);
			assert(~body.ok.indexOf('created new package'));
			cb();
		});
	},
	function(cb) {
		server.get_package('testpkg', function(res, body) {
			assert(res.statusCode === 200);
			assert(body.name === 'testpkg');
			cb();
		});
	},
	function(cb) {
		server.get_tarball('testpkg', 'blahblah', function(res, body) {
			assert(res.statusCode === 404);
			assert(~body.error.indexOf('no such file'));
			cb();
		});
	},
	function(cb) {
		server.put_tarball('testpkg', 'blahblah', readfile('fixtures/binary'), function(res, body) {
			assert(res.statusCode === 201);
			assert(body.ok);
			cb();
		});
	},
	function(cb) {
		server.get_tarball('testpkg', 'blahblah', function(res, body) {
			assert(res.statusCode === 200);
			assert.deepEqual(body, readfile('fixtures/binary').toString('utf8'));
			cb();
		});
	},
], function() {
	process.exit();
});

