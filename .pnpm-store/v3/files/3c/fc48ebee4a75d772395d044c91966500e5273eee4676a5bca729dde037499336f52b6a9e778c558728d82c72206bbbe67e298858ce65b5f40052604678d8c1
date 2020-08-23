'use strict'

const fs = require('fs')
const EventEmitter = require('events')
const flatstr = require('flatstr')
const inherits = require('util').inherits

const BUSY_WRITE_TIMEOUT = 100

const sleep = require('atomic-sleep')

// 16 MB - magic number
// This constant ensures that SonicBoom only needs
// 32 MB of free memory to run. In case of having 1GB+
// of data to write, this prevents an out of memory
// condition.
const MAX_WRITE = 16 * 1024 * 1024

function openFile (file, sonic) {
  sonic._opening = true
  sonic._writing = true
  sonic.file = file
  fs.open(file, 'a', (err, fd) => {
    if (err) {
      sonic.emit('error', err)
      return
    }

    sonic.fd = fd
    sonic._reopening = false
    sonic._opening = false
    sonic._writing = false

    sonic.emit('ready')

    if (sonic._reopening) {
      return
    }

    // start
    var len = sonic._buf.length
    if (len > 0 && len > sonic.minLength && !sonic.destroyed) {
      actualWrite(sonic)
    }
  })
}

function SonicBoom (fd, minLength, sync) {
  if (!(this instanceof SonicBoom)) {
    return new SonicBoom(fd, minLength, sync)
  }

  this._buf = ''
  this.fd = -1
  this._writing = false
  this._writingBuf = ''
  this._ending = false
  this._reopening = false
  this._asyncDrainScheduled = false
  this.file = null
  this.destroyed = false
  this.sync = sync || false

  this.minLength = minLength || 0

  if (typeof fd === 'number') {
    this.fd = fd
    process.nextTick(() => this.emit('ready'))
  } else if (typeof fd === 'string') {
    openFile(fd, this)
  } else {
    throw new Error('SonicBoom supports only file descriptors and files')
  }

  this.release = (err, n) => {
    if (err) {
      if (err.code === 'EAGAIN') {
        if (this.sync) {
          // This error code should not happen in sync mode, because it is
          // not using the underlining operating system asynchronous functions.
          // However it happens, and so we handle it.
          // Ref: https://github.com/pinojs/pino/issues/783
          try {
            sleep(BUSY_WRITE_TIMEOUT)
            this.release(undefined, 0)
          } catch (err) {
            this.release(err)
          }
        } else {
          // Let's give the destination some time to process the chunk.
          setTimeout(() => {
            fs.write(this.fd, this._writingBuf, 'utf8', this.release)
          }, BUSY_WRITE_TIMEOUT)
        }
      } else {
        this.emit('error', err)
      }
      return
    }

    if (this._writingBuf.length !== n) {
      this._writingBuf = this._writingBuf.slice(n)
      if (this.sync) {
        try {
          do {
            n = fs.writeSync(this.fd, this._writingBuf, 'utf8')
            this._writingBuf = this._writingBuf.slice(n)
          } while (this._writingBuf.length !== 0)
        } catch (err) {
          this.release(err)
          return
        }
      } else {
        fs.write(this.fd, this._writingBuf, 'utf8', this.release)
        return
      }
    }

    this._writingBuf = ''

    if (this.destroyed) {
      return
    }

    var len = this._buf.length
    if (this._reopening) {
      this._writing = false
      this._reopening = false
      this.reopen()
    } else if (len > 0 && len > this.minLength) {
      actualWrite(this)
    } else if (this._ending) {
      if (len > 0) {
        actualWrite(this)
      } else {
        this._writing = false
        actualClose(this)
      }
    } else {
      this._writing = false
      if (this.sync) {
        if (!this._asyncDrainScheduled) {
          this._asyncDrainScheduled = true
          process.nextTick(emitDrain, this)
        }
      } else {
        this.emit('drain')
      }
    }
  }
}

function emitDrain (sonic) {
  sonic._asyncDrainScheduled = false
  sonic.emit('drain')
}

inherits(SonicBoom, EventEmitter)

SonicBoom.prototype.write = function (data) {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  this._buf += data
  var len = this._buf.length
  if (!this._writing && len > this.minLength) {
    actualWrite(this)
  }
  return len < 16384
}

SonicBoom.prototype.flush = function () {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this._writing || this.minLength <= 0) {
    return
  }

  actualWrite(this)
}

SonicBoom.prototype.reopen = function (file) {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this._opening) {
    this.once('ready', () => {
      this.reopen(file)
    })
    return
  }

  if (this._ending) {
    return
  }

  if (!this.file) {
    throw new Error('Unable to reopen a file descriptor, you must pass a file to SonicBoom')
  }

  this._reopening = true

  if (this._writing) {
    return
  }

  fs.close(this.fd, (err) => {
    if (err) {
      return this.emit('error', err)
    }
  })

  openFile(file || this.file, this)
}

SonicBoom.prototype.end = function () {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this._opening) {
    this.once('ready', () => {
      this.end()
    })
    return
  }

  if (this._ending) {
    return
  }

  this._ending = true

  if (!this._writing && this._buf.length > 0 && this.fd >= 0) {
    actualWrite(this)
    return
  }

  if (this._writing) {
    return
  }

  actualClose(this)
}

SonicBoom.prototype.flushSync = function () {
  if (this.destroyed) {
    throw new Error('SonicBoom destroyed')
  }

  if (this.fd < 0) {
    throw new Error('sonic boom is not ready yet')
  }

  if (this._buf.length > 0) {
    fs.writeSync(this.fd, this._buf, 'utf8')
    this._buf = ''
  }
}

SonicBoom.prototype.destroy = function () {
  if (this.destroyed) {
    return
  }
  actualClose(this)
}

function actualWrite (sonic) {
  sonic._writing = true
  var buf = sonic._buf
  var release = sonic.release
  if (buf.length > MAX_WRITE) {
    buf = buf.slice(0, MAX_WRITE)
    sonic._buf = sonic._buf.slice(MAX_WRITE)
  } else {
    sonic._buf = ''
  }
  flatstr(buf)
  sonic._writingBuf = buf
  if (sonic.sync) {
    try {
      var written = fs.writeSync(sonic.fd, buf, 'utf8')
      release(null, written)
    } catch (err) {
      release(err)
    }
  } else {
    fs.write(sonic.fd, buf, 'utf8', release)
  }
}

function actualClose (sonic) {
  if (sonic.fd === -1) {
    sonic.once('ready', actualClose.bind(null, sonic))
    return
  }
  // TODO write a test to check if we are not leaking fds
  fs.close(sonic.fd, (err) => {
    if (err) {
      sonic.emit('error', err)
      return
    }

    if (sonic._ending && !sonic._writing) {
      sonic.emit('finish')
    }
    sonic.emit('close')
  })
  sonic.destroyed = true
  sonic._buf = ''
}

module.exports = SonicBoom
