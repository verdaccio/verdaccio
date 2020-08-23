'use strict'

const Q = require(`q`)
const parserOpts = require(`./parser-opts`)
const writerOpts = require(`./writer-opts`)

module.exports = function (config) {
  return Q.all([parserOpts, writerOpts])
    .spread((parserOpts, writerOpts) => {
      return { parserOpts, writerOpts }
    })
}
