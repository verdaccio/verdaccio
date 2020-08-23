'use strict'

const SonicBoom = require('..')

const out = new SonicBoom(process.stdout.fd)
const str = Buffer.alloc(1000).fill('a').toString()

let i = 0

function write () {
  if (i++ === 10) {
    return
  }

  if (out.write(str)) {
    write()
  } else {
    out.once('drain', write)
  }
}

write()
