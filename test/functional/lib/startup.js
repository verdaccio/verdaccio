var fork     = require('child_process').fork
var express  = require('express')
var rimraf   = require('rimraf')
var Server   = require('./server')

var forks = process.forks = []
process.server  = Server('http://localhost:55551/')
process.server2 = Server('http://localhost:55552/')
process.express = express()
process.express.listen(55550)

module.exports.start = function start(dir, conf, cb) {
  rimraf(__dirname + '/../' + dir, function() {
    // filter out --debug-brk
    var oldArgv = process.execArgv
    process.execArgv = process.execArgv.filter(function(x) {
      return x !== '--debug-brk'
    })

    var f = fork(__dirname + '/../../../bin/verdaccio'
              , ['-c', __dirname + '/../' + conf]
              , {silent: !process.env.TRAVIS}
    )
    forks.push(f)
    f.on('message', function(msg) {
      if ('sinopia_started' in msg) {
        cb(), cb = function(){}
      }
    })
    f.on('error', function(err) {
      throw err
    })
    process.execArgv = oldArgv
  })
}

process.on('exit', function() {
  if (forks[0]) forks[0].kill()
  if (forks[1]) forks[1].kill()
})

