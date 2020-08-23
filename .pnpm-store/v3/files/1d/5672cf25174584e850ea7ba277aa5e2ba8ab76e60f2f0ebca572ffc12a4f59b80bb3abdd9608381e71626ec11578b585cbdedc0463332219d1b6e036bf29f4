'use strict'

const { EventEmitter } = require('events')
const debug = require('debug')('nock.socket')

module.exports = class Socket extends EventEmitter {
  constructor(options) {
    super()

    if (options.proto === 'https') {
      // https://github.com/nock/nock/issues/158
      this.authorized = true
    }

    this.bufferSize = 0
    this.writableLength = 0
    this.writable = true
    this.readable = true
    this.pending = false
    this.destroyed = false
    this.connecting = false

    // totalDelay that has already been applied to the current
    // request/connection, timeout error will be generated if
    // it is timed-out.
    this.totalDelayMs = 0
    // Maximum allowed delay. Null means unlimited.
    this.timeoutMs = null

    const ipv6 = options.family === 6
    this.remoteFamily = ipv6 ? 'IPv6' : 'IPv4'
    this.localAddress = this.remoteAddress = ipv6 ? '::1' : '127.0.0.1'
    this.localPort = this.remotePort = parseInt(options.port)
  }

  setNoDelay() {}
  setKeepAlive() {}
  resume() {}
  ref() {}
  unref() {}

  address() {
    return {
      port: this.remotePort,
      family: this.remoteFamily,
      address: this.remoteAddress,
    }
  }

  setTimeout(timeoutMs, fn) {
    this.timeoutMs = timeoutMs
    if (fn) {
      this.once('timeout', fn)
    }
  }

  applyDelay(delayMs) {
    this.totalDelayMs += delayMs

    if (this.timeoutMs && this.totalDelayMs > this.timeoutMs) {
      debug('socket timeout')
      this.emit('timeout')
    }
  }

  getPeerCertificate() {
    return Buffer.from(
      (Math.random() * 10000 + Date.now()).toString()
    ).toString('base64')
  }

  destroy(err) {
    this.destroyed = true
    this.readable = this.writable = false
    if (err) {
      this.emit('error', err)
    }
    return this
  }
}
