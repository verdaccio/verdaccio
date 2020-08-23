'use strict'

const SonicBoom = require('.')
const sonic = new SonicBoom({ fd: process.stdout.fd }) // or 'destination'

for (var i = 0; i < 10; i++) {
  sonic.write('hello sonic\n')
}
