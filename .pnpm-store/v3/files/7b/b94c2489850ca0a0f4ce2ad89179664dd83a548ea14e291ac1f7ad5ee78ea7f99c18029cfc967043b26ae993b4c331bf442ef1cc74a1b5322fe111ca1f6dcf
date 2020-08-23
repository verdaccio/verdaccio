'use strict'

/**
 * Creates a stream which becomes the response body of the interceptor when a
 * delay is set. The stream outputs the intended body and EOF after the delay.
 *
 * @param  {String|Buffer|Stream} body - the body to write/pipe out
 * @param  {Integer} ms - The delay in milliseconds
 * @constructor
 */

const { Transform } = require('stream')
const common = require('./common')

module.exports = class DelayedBody extends Transform {
  constructor(ms, body) {
    super()

    const self = this
    let data = ''
    let ended = false

    if (common.isStream(body)) {
      body.on('data', function(chunk) {
        data += Buffer.isBuffer(chunk) ? chunk.toString() : chunk
      })

      body.once('end', function() {
        ended = true
      })

      body.resume()
    }

    // TODO: This would be more readable if the stream case were moved into
    // the `if` statement above.
    common.setTimeout(function() {
      if (common.isStream(body) && !ended) {
        body.once('end', function() {
          self.end(data)
        })
      } else {
        self.end(data || body)
      }
    }, ms)
  }

  _transform(chunk, encoding, cb) {
    this.push(chunk)
    process.nextTick(cb)
  }
}
