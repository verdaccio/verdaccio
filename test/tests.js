var fs = require('fs')
  , async = require('async')
  , assert = require('assert')
  , Server = require('./lib/server')
  , readfile = require('fs').readFileSync
  , express = require('express')
  , ex = module.exports

var forks = process.forks = []
process.server = new Server('http://localhost:55551/')
process.server2 = new Server('http://localhost:55552/')
process.express = express()

process.express.listen(55550)

ex['Startup:'] = require('./startup')
ex['Basic:'] = require('./basic')
ex['Mirror:'] = require('./mirror')
ex['Race:'] = require('./race')
ex['Tags:'] = require('./tags')

process.on('exit', function() {
	if (forks[0]) forks[0].kill()
	if (forks[1]) forks[1].kill()
})

