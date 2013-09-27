var fs = require('fs');
var async = require('async');
var assert = require('assert');
var Server = require('./lib/server');
var readfile = require('fs').readFileSync;
var ex = module.exports;

var forks = process.forks = [];
process.server = new Server('http://localhost:55551/');
process.server2 = new Server('http://localhost:55552/');

ex['Startup:'] = require('./startup');
ex['Basic:'] = require('./basic');
ex['Mirror:'] = require('./mirror');

process.on('exit', function() {
	if (forks[0]) forks[0].kill();
	if (forks[1]) forks[1].kill();
});

