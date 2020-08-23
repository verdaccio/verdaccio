'use strict'

var bench = require('fastbench')
var SonicBoom = require('./')
var fs = require('fs')

var core = fs.createWriteStream('/dev/null')
var fd = fs.openSync('/dev/null', 'w')
var sonic = new SonicBoom(fd)
var sonic4k = new SonicBoom(fd, 4096)
var sonicSync = new SonicBoom(fd, 0, true)
var sonicSync4k = new SonicBoom(fd, 4096, true)

var MAX = 10000

function str () {
  var res = ''

  for (var i = 0; i < 10; i++) {
    res += 'hello'
  }

  return res
}

setTimeout(doBench, 100)

var run = bench([
  function benchSonic (cb) {
    sonic.once('drain', cb)
    for (var i = 0; i < MAX; i++) {
      sonic.write(str())
    }
  },
  function benchSonicSync (cb) {
    sonicSync.once('drain', cb)
    for (var i = 0; i < MAX; i++) {
      sonicSync.write(str())
    }
  },
  function benchSonic4k (cb) {
    sonic4k.once('drain', cb)
    for (var i = 0; i < MAX; i++) {
      sonic4k.write(str())
    }
  },
  function benchSonicSync4k (cb) {
    sonicSync4k.once('drain', cb)
    for (var i = 0; i < MAX; i++) {
      sonicSync4k.write(str())
    }
  },
  function benchCore (cb) {
    core.once('drain', cb)
    for (var i = 0; i < MAX; i++) {
      core.write(str())
    }
  }
], 1000)

function doBench () {
  run(run)
}
