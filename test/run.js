#!/usr/bin/env node

var Server = require('./lib/server');

process.argv = ['node', 'sinopia', '-c', './config.yaml'];
require('../bin/sinopia');

setTimeout(function() {
	var server = new Server('http://localhost:55550/');
	server.auth('test', 'test', function() {
		console.log('ok');
	});
}, 1000);

