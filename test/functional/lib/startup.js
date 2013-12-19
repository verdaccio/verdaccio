var rimraf = require('rimraf')
  , fork = require('child_process').fork
  , assert = require('assert')
  , express = require('express')
  , readfile = require('fs').readFileSync
  , Server = require('./server')

var forks = process.forks = []
process.server = new Server('http://localhost:55551/')
process.server2 = new Server('http://localhost:55552/')
process.express = express()
process.express.listen(55550)

module.exports.start = function start(dir, conf, cb) {
	rimraf(__dirname + '/../' + dir, function() {
		var f = fork(__dirname + '/../../../bin/sinopia'
		          , ['-c', __dirname + '/../' + conf]
		          , {silent: true}
		)
		forks.push(f)
		f.on('message', function(msg) {
			if ('sinopia_started' in msg) {
				cb()
			}
		})
	})
}

process.on('exit', function() {
	if (forks[0]) forks[0].kill()
	if (forks[1]) forks[1].kill()
})

