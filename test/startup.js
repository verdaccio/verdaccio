var rimraf = require('rimraf');
var fork = require('child_process').fork;
var assert = require('assert');
var readfile = require('fs').readFileSync;
var ex = module.exports;
var server = process.server;
var server2 = process.server2;
var forks = process.forks;

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

ex['authentication to servers'] = function(cb) {
	var count = 0;
	[server, server2].forEach(function(server) {
		count++;
		server.auth('test', 'test', function(res, body) {
			assert.equal(res.statusCode, 201);
			assert.notEqual(body.ok.indexOf('"test"'), -1);
			if (!--count) cb();
		});
	});
};
