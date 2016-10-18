var fs        = require('fs')
var Error     = require('http-errors')
var mkdirp    = require('mkdirp')
var Path      = require('path')
var MyStreams = require('./streams')

function FSError(code) {
  var err = Error(code)
  err.code = code
  return err
}

var locker    = require('./file-locking')

function tempFile(str) {
  return str + '.tmp' + String(Math.random()).substr(2)
}

function renameTmp(src, dst, _cb) {
  function cb(err) {
    if (err) fs.unlink(src)
    _cb(err)
  }

  if (process.platform !== 'win32') {
    return fs.rename(src, dst, cb)
  }

  // windows can't remove opened file,
  // but it seem to be able to rename it
  var tmp = tempFile(dst)
  fs.rename(dst, tmp, function(err) {
    fs.rename(src, dst, cb)
    if (!err) fs.unlink(tmp)
  })
}

function write(dest, data, cb) {
  var safe_write = function(cb) {
    var tmpname = tempFile(dest)
    fs.writeFile(tmpname, data, function(err) {
      if (err) return cb(err)
      renameTmp(tmpname, dest, cb)
    })
  }

  safe_write(function(err) {
    if (err && err.code === 'ENOENT') {
      mkdirp(Path.dirname(dest), function(err) {
        if (err) return cb(err)
        safe_write(cb)
      })
    } else {
      cb(err)
    }
  })
}

function write_stream(name) {
  var stream = MyStreams.UploadTarballStream()

  var _ended = 0
  stream.on('end', function() {
    _ended = 1
  })

  fs.exists(name, function(exists) {
    if (exists) return stream.emit('error', FSError('EEXISTS'))

    var tmpname = name + '.tmp-'+String(Math.random()).replace(/^0\./, '')
    var file = fs.createWriteStream(tmpname)
    var opened = false
    stream.pipe(file)

    stream.done = function() {
      function onend() {
        file.on('close', function() {
          renameTmp(tmpname, name, function(err) {
            if (err) {
              stream.emit('error', err)
            } else {
              stream.emit('success')
            }
          })
        })
        file.destroySoon()
      }
      if (_ended) {
        onend()
      } else {
        stream.on('end', onend)
      }
    }
    stream.abort = function() {
      if (opened) {
        opened = false
        file.on('close', function() {
          fs.unlink(tmpname, function(){})
        })
      }
      file.destroySoon()
    }
    file.on('open', function() {
      opened = true
      // re-emitting open because it's handled in storage.js
      stream.emit('open')
    })
    file.on('error', function(err) {
      stream.emit('error', err)
    })
  })
  return stream
}

function read_stream(name, stream, callback) {
  var rstream = fs.createReadStream(name)
  rstream.on('error', function(err) {
    stream.emit('error', err)
  })
  rstream.on('open', function(fd) {
    fs.fstat(fd, function(err, stats) {
      if (err) return stream.emit('error', err)
      stream.emit('content-length', stats.size)
      stream.emit('open')
      rstream.pipe(stream)
    })
  })

  stream = MyStreams.ReadTarballStream()
  stream.abort = function() {
    rstream.close()
  }
  return stream
}

function create(name, contents, callback) {
  fs.exists(name, function(exists) {
    if (exists) return callback( FSError('EEXISTS') )
    write(name, contents, callback)
  })
}

function update(name, contents, callback) {
  fs.exists(name, function(exists) {
    if (!exists) return callback( FSError('ENOENT') )
    write(name, contents, callback)
  })
}

function read(name, callback) {
  fs.readFile(name, callback)
}

module.exports.read = read

module.exports.read_json = function(name, cb) {
  read(name, function(err, res) {
    if (err) return cb(err)

    var args = []
    try {
      args = [ null, JSON.parse(res.toString('utf8')) ]
    } catch(err) {
      args = [ err ]
    }
    cb.apply(null, args)
  })
}

module.exports.lock_and_read = function(name, cb) {
  locker.readFile(name, {lock: true}, function(err, res) {
    if (err) return cb(err)
    return cb(null, res)
  })
}

module.exports.lock_and_read_json = function(name, cb) {
  locker.readFile(name, {lock: true, parse: true}, function(err, res) {
    if (err) return cb(err)
    return cb(null, res);
  })
}

module.exports.unlock_file = function (name, cb) {
  locker.unlockFile(name, cb)
}

module.exports.create = create

module.exports.create_json = function(name, value, cb) {
  create(name, JSON.stringify(value, null, '\t'), cb)
}

module.exports.update = update

module.exports.update_json = function(name, value, cb) {
  update(name, JSON.stringify(value, null, '\t'), cb)
}

module.exports.write = write

module.exports.write_json = function(name, value, cb) {
  write(name, JSON.stringify(value, null, '\t'), cb)
}

module.exports.write_stream = write_stream

module.exports.read_stream = read_stream

module.exports.unlink = fs.unlink

module.exports.rmdir = fs.rmdir

