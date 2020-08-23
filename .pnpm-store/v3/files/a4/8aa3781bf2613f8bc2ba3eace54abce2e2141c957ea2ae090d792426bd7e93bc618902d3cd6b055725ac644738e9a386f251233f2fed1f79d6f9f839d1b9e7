'use strict'

const SonicBoom = require('.')
const sonic = new SonicBoom(process.stdout.fd)

let count = 0
function scheduleWrites () {
  for (var i = 0; i < 1000; i++) {
    sonic.write('hello sonic\n')
    console.log('hello console')
  }

  if (++count < 10) {
    setTimeout(scheduleWrites, 100)
  }
}

scheduleWrites()
