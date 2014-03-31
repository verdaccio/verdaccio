var fs = require('fs')
  , Path = require('path')
  , mkdirp = require('mkdirp')
  , mystreams = require('./streams')
  , FSError = require('./error').FSError

try {
	var fsExt = require('fs-ext')
} catch(e) {
	fsExt = {
		flock: function() {
			arguments[arguments.length-1]()
		}
	}
}

function write(dest, data, cb) {
	var safe_write = function(cb) {
		var tmpname = dest + '.tmp' + String(Math.random()).substr(2)
		fs.writeFile(tmpname, data, function(err) {
			if (err) return cb(err)
			return fs.rename(tmpname, dest, cb)
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
	var stream = new mystreams.UploadTarballStream()

	var _ended = 0
	stream.on('end', function() {
		_ended = 1
	})

	fs.exists(name, function(exists) {
		if (exists) return stream.emit('error', new FSError('EEXISTS'))

		var tmpname = name + '.tmp-'+String(Math.random()).replace(/^0\./, '')
		  , file = fs.createWriteStream(tmpname)
		  , opened = false
		stream.pipe(file)

		stream.done = function() {
			function onend() {
				file.on('close', function() {
					fs.rename(tmpname, name, function(err) {
						if (err) stream.emit('error', err)
						stream.emit('success')
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

	var stream = new mystreams.ReadTarballStream()
	stream.abort = function() {
		rstream.close()
	}
	return stream
}

function create(name, contents, callback) {
	fs.exists(name, function(exists) {
		if (exists) return callback(new FSError('EEXISTS'))
		write(name, contents, callback)
	})
}

function update(name, contents, callback) {
	fs.exists(name, function(exists) {
		if (!exists) return callback(new FSError('ENOENT'))
		write(name, contents, callback)
	})
}

function read(name, callback) {
	fs.readFile(name, callback)
}

// open and flock with exponential backoff
function open_flock(name, opmod, flmod, tries, backoff, cb) {
	fs.open(name, opmod, function(err, fd) {
		if (err) return cb(err, fd)

		fsExt.flock(fd, flmod, function(err) {
			if (err) {
				if (!tries) {
					fs.close(fd, function() {
						cb(err)
					})
				} else {
					fs.close(fd, function() {
						setTimeout(function() {
							open_flock(name, opmod, flmod, tries-1, backoff*2, cb)
						}, backoff)
					})
				}
			} else {
				cb(null, fd)
			}
		})
	})
}

// this function neither unlocks file nor closes it
// it'll have to be done manually later
function lock_and_read(name, callback) {
	open_flock(name, 'r', 'exnb', 4, 10, function(err, fd) {
		if (err) return callback(err, fd)

		fs.fstat(fd, function(err, st) {
			if (err) return callback(err, fd)

			var buffer = new Buffer(st.size)
			fs.read(fd, buffer, 0, st.size, null, function(err, bytesRead, buffer) {
				if (bytesRead != st.size) return callback(new Error('st.size != bytesRead'), fd)

				callback(null, fd, buffer)
			})
		})
	})
}

module.exports.read = read

module.exports.read_json = function(name, cb) {
	read(name, function(err, res) {
		if (err) return cb(err)

		var args = []
		try {
			args = [null, JSON.parse(res.toString('utf8'))]
		} catch(err) {
			args = [err]
		}
		cb.apply(null, args)
	})
}

module.exports.lock_and_read = lock_and_read

module.exports.lock_and_read_json = function(name, cb) {
	lock_and_read(name, function(err, fd, res) {
		if (err) return cb(err, fd)

		var args = []
		try {
			args = [null, fd, JSON.parse(res.toString('utf8'))]
		} catch(err) {
			args = [err, fd]
		}
		cb.apply(null, args)
	})
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

