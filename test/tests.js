var fs = require('fs')
  , async = require('async')
  , assert = require('assert')
  , Server = require('./lib/server')
  , readfile = require('fs').readFileSync
  , ex = module.exports

var forks = process.forks = []
process.server = new Server('http://localhost:55551/')
process.server2 = new Server('http://localhost:55552/')

ex['Startup:'] = require('./startup')
ex['Basic:'] = require('./basic')
ex['Mirror:'] = require('./mirror')
ex['Race:'] = require('./race')

process.on('exit', function() {
	if (forks[0]) forks[0].kill()
	if (forks[1]) forks[1].kill()
})

