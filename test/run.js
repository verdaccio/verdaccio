#!/usr/local/bin/node --harmony

var galaxy = require('galaxy');
var Auth = galaxy.star(require('./lib/auth'));

var sleep = galaxy.star(function(ms, cb) {
	setTimeout(cb, ms);
});

process.argv = ['node', 'sinopia', '-c', './config.yaml'];
require('../bin/sinopia');

galaxy.unstar(function*() {
	sleep(1000);
	yield Auth.auth('test', 'test');
})();

