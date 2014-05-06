var fs = require('fs')
  , Path = require('path')
  , crypto = require('crypto')
  , assert = require('assert')
  , fs_storage = require('./local-fs')
  , UError = require('./error').UserError
  , utils = require('./utils')
  , mystreams = require('./streams')
  , Logger = require('./logger')
  , info_file = 'package.json'

//
// Implements Storage interface
// (same for storage.js, local-storage.js, up-storage.js)
//
function Storage(config) {
	if (!(this instanceof Storage)) return new Storage(config)
	this.config = config
	this.logger = Logger.logger.child({sub: 'fs'})
	return this
}

// returns the minimal package file
function get_boilerplate(name) {
	return {
		// standard things
		name: name,
		versions: {},
		'dist-tags': {},

		// our own object
		'_distfiles': {},
		'_attachments': {},
		'_uplinks': {},
	}
}

Storage.prototype._internal_error = function(err, file, msg) {
	this.logger.error( {err: err, file: file}
					 , msg + ' @{file}: @{!err.message}'
					 )
	return new UError({
		status: 500,
		msg: 'internal server error'
	})
}

Storage.prototype.add_package = function(name, metadata, callback) {
	this.storage(name).create_json(info_file, get_boilerplate(name), function(err) {
		if (err && err.code === 'EEXISTS') {
			return callback(new UError({
				status: 409,
				msg: 'this package is already present'
			}))
		}
		callback()
	})
}

Storage.prototype.remove_package = function(name, callback) {
	var self = this
	self.logger.info({name: name}, 'unpublishing @{name} (all)')
	self.storage(name).read_json(info_file, function(err, data) {
		if (err) {
			if (err.code === 'ENOENT') {
				return callback(new UError({
					status: 404,
					msg: 'no such package available',
				}))
			} else {
				return callback(err)
			}
		}
		self._normalize_package(data)

		self.storage(name).unlink(info_file, function(err) {
			if (err) return callback(err)

			var files = Object.keys(data._attachments)

			function unlinkNext(cb) {
				if (files.length === 0) return cb()

				var file = files.shift()
				self.storage(name).unlink(file, function() {
					unlinkNext(cb)
				})
			}

			unlinkNext(function() {
				// try to unlink the directory, but ignore errors because it can fail
				self.storage(name).rmdir('.', function(err) {
					callback(err)
				})
			})
		})
	})
}

Storage.prototype._read_create_package = function(name, callback) {
	var self = this
	self.storage(name).read_json(info_file, function(err, data) {
		// TODO: race condition
		if (err) {
			if (err.code === 'ENOENT') {
				// if package doesn't exist, we create it here
				data = get_boilerplate(name)
			} else {
				return callback(self._internal_error(err, info_file, 'error reading'))
			}
		}
		self._normalize_package(data)
		callback(null, data)
	})
}

// synchronize remote package info with the local one
// TODO: readfile called twice
Storage.prototype.update_versions = function(name, newdata, callback) {
	var self = this
	self._read_create_package(name, function(err, data) {
		if (err) return callback(err)

		var change = false
		for (var ver in newdata.versions) {
			if (data.versions[ver] == null) {
				var verdata = newdata.versions[ver]

				// why does anyone need to keep that in database?
				delete verdata.readme

				change = true
				data.versions[ver] = verdata

				if (verdata.dist && verdata.dist.tarball) {
					var url = utils.parse_tarball_url(
						/*verdata.dist.__sinopia_orig_tarball ||*/ verdata.dist.tarball
					)

					// we do NOT overwrite any existing records
					if (url != null && data._distfiles[url.filename] == null) {
						data._distfiles[url.filename] = {
							url: /*verdata.dist.__sinopia_orig_tarball ||*/ verdata.dist.tarball,
							sha: verdata.dist.shasum,
						}
					}
				}
			}
		}
		for (var tag in newdata['dist-tags']) {
			if (!Array.isArray(data['dist-tags'][tag]) || data['dist-tags'][tag].length != newdata['dist-tags'][tag].length) {
				// backward compat
				var need_change = true
			} else {
				for (var i=0; i<data['dist-tags'][tag].length; i++) {
					if (data['dist-tags'][tag][i] != newdata['dist-tags'][tag][i]) {
						var need_change = true
						break
					}
				}
			}

			if (need_change) {
				change = true
				data['dist-tags'][tag] = newdata['dist-tags'][tag]
			}
		}
		for (var up in newdata._uplinks) {
			var need_change =
				!utils.is_object(data._uplinks[up]) || (newdata._uplinks[up].etag !== data._uplinks[up].etag || (newdata._uplinks[up].fetched !== data._uplinks[up].fetched))

			if (need_change) {
				change = true
				data._uplinks[up] = newdata._uplinks[up]
			}
		}

		if (change) {
			self.logger.debug('updating package info')
			self._write_package(name, data, function(err) {
				callback(err, data)
			})
		} else {
			callback(null, data)
		}
	})
}

Storage.prototype.add_version = function(name, version, metadata, tag, callback) {
	var self = this
	self.update_package(name, function updater(data, cb) {
		// why does anyone need to keep that in database?
		delete metadata.readme

		if (data.versions[version] != null) {
			return cb(new UError({
				status: 409,
				msg: 'this version already present'
			}))
		}

		// if uploaded tarball has a different shasum, it's very likely that we have some kind of error
		if (utils.is_object(metadata.dist) && typeof(metadata.dist.tarball) === 'string') {
			var tarball = metadata.dist.tarball.replace(/.*\//, '')
			if (utils.is_object(data._attachments[tarball])) {
				if (data._attachments[tarball].shasum != null && metadata.dist.shasum != null) {
					if (data._attachments[tarball].shasum != metadata.dist.shasum) {
						return cb(new UError({
							status: 400,
							msg: 'shasum error, ' + data._attachments[tarball].shasum + ' != ' + metadata.dist.shasum,
						}))
					}
				}

				data._attachments[tarball].version = version
			}
		}

		data.versions[version] = metadata
		utils.tag_version(data, version, tag, self.config)
		cb()
	}, callback)
}

Storage.prototype.add_tags = function(name, tags, callback) {
	var self = this

	self.update_package(name, function updater(data, cb) {
		for (var t in tags) {
			if (data.versions[tags[t]] == null) {
				return cb(new UError({
					status: 404,
					msg: "this version doesn't exist"
				}))
			}

			utils.tag_version(data, tags[t], t, self.config)
			cb()
		}
	}, callback)
}

// change package info to tag a specific version
function _add_tag(data, version, tag) {
	data['dist-tags'][tag] = version
}

// currently supports unpublishing only
Storage.prototype.change_package = function(name, metadata, revision, callback) {
	var self = this

	if (!utils.is_object(metadata.versions) || !utils.is_object(metadata['dist-tags'])) {
		return callback(new UError({
			status: 422,
			msg: 'bad data',
		}))
	}

	self.update_package(name, function updater(data, cb) {
		for (var ver in data.versions) {
			if (metadata.versions[ver] == null) {
				self.logger.info({name: name, version: ver}, 'unpublishing @{name}@@{version}')
				delete data.versions[ver]

				for (var file in data._attachments) {
					if (data._attachments[file].version === ver) {
						delete data._attachments[file].version
					}
				}
			}
		}
		data['dist-tags'] = metadata['dist-tags']
		cb()
	}, function(err) {
		if (err) return callback(err)
		callback()
	})
}

Storage.prototype.remove_tarball = function(name, filename, revision, callback) {
	var self = this
	assert(utils.validate_name(filename))

	self.update_package(name, function updater(data, cb) {
		if (data._attachments[filename]) {
			delete data._attachments[filename]
			cb()
		} else {
			cb(new UError({
				status: 404,
				msg: 'no such file available',
			}))
		}
	}, function(err) {
		if (err) return callback(err)
		self.storage(name).unlink(filename, callback)
	})
}

Storage.prototype.add_tarball = function(name, filename) {
	assert(utils.validate_name(filename))

	var stream = new mystreams.UploadTarballStream()
	  , _transform = stream._transform
	  , length = 0
	  , shasum = crypto.createHash('sha1')

	stream._transform = function(data) {
		shasum.update(data)
		length += data.length
		_transform.apply(stream, arguments)
	}

	var self = this
	if (name === info_file || name === '__proto__') {
		stream.emit('error', new UError({
			status: 403,
			msg: 'can\'t use this filename'
		}))
	}

	var wstream = this.storage(name).write_stream(filename)

	wstream.on('error', function(err) {
		if (err.code === 'EEXISTS') {
			stream.emit('error', new UError({
				status: 409,
				msg: 'this tarball is already present'
			}))
		} else if (err.code === 'ENOENT') {
			// check if package exists to throw an appropriate message
			self.get_package(name, function(_err, res) {
				if (_err) {
					stream.emit('error', _err)
				} else {
					stream.emit('error', err)
				}
			})
		} else {
			stream.emit('error', err)
		}
	})

	wstream.on('open', function() {
		// re-emitting open because it's handled in storage.js
		stream.emit('open')
	})
	wstream.on('success', function() {
		self.update_package(name, function updater(data, cb) {
			data._attachments[filename] = {
				shasum: shasum.digest('hex'),
			}
			cb()
		}, function(err) {
			if (err) {
				stream.emit('error', err)
			} else {
				stream.emit('success')
			}
		})
	})
	stream.abort = function() {
		wstream.abort()
	}
	stream.done = function() {
		if (!length) {
			stream.emit('error', new UError({
				status: 422,
				msg: 'refusing to accept zero-length file'
			}))
			wstream.abort()
		} else {
			wstream.done()
		}
	}
	stream.pipe(wstream)

	return stream
}

Storage.prototype.get_tarball = function(name, filename, callback) {
	assert(utils.validate_name(filename))

	var stream = new mystreams.ReadTarballStream()
	stream.abort = function() {
		rstream.abort()
	}

	var rstream = this.storage(name).read_stream(filename)
	rstream.on('error', function(err) {
		if (err && err.code === 'ENOENT') {
			stream.emit('error', new UError({
				status: 404,
				msg: 'no such file available',
			}))
		} else {
			stream.emit('error', err)
		}
	})
	rstream.on('content-length', function(v) {
		stream.emit('content-length', v)
	})
	rstream.on('open', function() {
		// re-emitting open because it's handled in storage.js
		stream.emit('open')
		rstream.pipe(stream)
	})
	return stream
}

Storage.prototype.get_package = function(name, options, callback) {
	if (typeof(options) === 'function') callback = options, options = {}

	var self = this

	self.storage(name).read_json(info_file, function(err, result) {
		if (err) {
			if (err.code === 'ENOENT') {
				return callback(new UError({
					status: 404,
					msg: 'no such package available'
				}))
			} else {
				return callback(self._internal_error(err, info_file, 'error reading'))
			}
		}
		self._normalize_package(result)
		callback(err, result)
	})
}

//
// This function allows to update the package thread-safely
//
// Arguments:
// - name - package name
// - updateFn - function(package, cb) - update function
// - callback - callback that gets invoked after it's all updated
//
// Algorithm:
// 1. lock package.json for writing
// 2. read package.json
// 3. updateFn(pkg, cb), and wait for cb
// 4. write package.json.tmp
// 5. move package.json.tmp package.json
// 6. callback(err?)
//
Storage.prototype.update_package = function(name, updateFn, _callback) {
	var self = this
	self.storage(name).lock_and_read_json(info_file, function(err, fd, json) {
		function callback() {
			var _args = arguments
			if (fd) {
				fs.close(fd, function(err) {
					if (err) return _callback(err)
					_callback.apply(null, _args)
				})
			} else {
				_callback.apply(null, _args)
			}
		}

		if (err) {
			if (err.code === 'EAGAIN') {
				return callback(new UError({
					status: 503,
					msg: 'resource temporarily unavailable'
				}))
			} else if (err.code === 'ENOENT') {
				return callback(new UError({
					status: 404,
					msg: 'no such package available',
				}))
			} else {
				return callback(err)
			}
		}

		self._normalize_package(json)
		updateFn(json, function(err) {
			if (err) return callback(err)

			self._write_package(name, json, callback)
		})
	})
}

Storage.prototype._normalize_package = function(pkg) {
	;['versions', 'dist-tags', '_distfiles', '_attachments', '_uplinks'].forEach(function(key) {
		if (!utils.is_object(pkg[key])) pkg[key] = {}
	})
	if (typeof(pkg._rev) !== 'string') pkg._rev = '0-0000000000000000'
}

Storage.prototype._write_package = function(name, json, callback) {

	// calculate revision a la couchdb
	if (typeof(json._rev) !== 'string') json._rev = '0-0000000000000000'
	var rev = json._rev.split('-')
	json._rev = ((+rev[0] || 0) + 1) + '-' + crypto.pseudoRandomBytes(8).toString('hex')

	this.storage(name).write_json(info_file, json, callback)
}

Storage.prototype.storage = function(package) {
	return new Path_Wrapper(
		Path.join(
			Path.resolve(
				Path.dirname(this.config.self_path),
				this.config.get_package_setting(package, 'storage') || this.config.storage
			),
			package
		)
	)
}

var Path_Wrapper = (function() {
	// a wrapper adding paths to fs_storage methods
	function Wrapper(path) {
		this.path = path
	}

	for (var i in fs_storage) {
		if (fs_storage.hasOwnProperty(i)) {
			Wrapper.prototype[i] = wrapper(i)
		}
	}

	function wrapper(method) {
		return function(/*...*/) {
			var args = Array.prototype.slice.apply(arguments)
			args[0] = Path.join(this.path, args[0] || '')
			return fs_storage[method].apply(null, args)
		}
	}

	return Wrapper
})()

module.exports = Storage

