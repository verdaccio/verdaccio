#!/usr/bin/env node

var Server = require('./lib/server')
  , forks = process.forks = []
  , server = process.server = new Server('http://localhost:55551/')
  , server2 = process.server2 = new Server('http://localhost:55552/')

process.on('exit', function() {
	if (forks[0]) forks[0].kill()
	if (forks[1]) forks[1].kill()
})

var repl = require('repl').start({
	prompt: "> ",
	input: process.stdin,
	output: process.stdout,
})

repl.context.server = server
repl.context.server2 = server2

