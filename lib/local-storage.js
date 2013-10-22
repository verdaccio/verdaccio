var fs = require('fs')
  , semver = require('semver')
  , Path = require('path')
  , crypto = require('crypto')
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
	var path = Path.resolve(Path.dirname(this.config.self_path), this.config.storage)
	this.storage = new fs_storage(path)
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
	};
}

Storage.prototype._internal_error = function(err, file, msg) {
	this.logger.error( {err: err, file: this.storage.path_to(file)}
	                 , msg + ' @{file}: @{!err.message}'
	                 )
	return new UError({
		status: 500,
		msg: 'internal server error'
	})
}

Storage.prototype.add_package = function(name, metadata, callback) {
	this.storage.create_json(name + '/' + info_file, get_boilerplate(name), function(err) {
		if (err && err.code === 'EEXISTS') {
			return callback(new UError({
				status: 409,
				msg: 'this package is already present'
			}));
		}
		callback();
	});
}

Storage.prototype.remove_package = function(name, callback) {
	var self = this
	self.storage.unlink(name + '/' + info_file, function(err) {
		if (err && err.code === 'ENOENT') {
			return callback(new UError({
				status: 404,
				msg: 'no such package available',
			}))
		}

		// try to unlink the directory, but ignore errors because it can fail
		self.storage.rmdir(name, function(err) {
			callback()
		})
	})
}

Storage.prototype._read_create_package = function(name, callback) {
	var self = this
	  , file = name + '/' + info_file
	self.storage.read_json(file, function(err, data) {
		// TODO: race condition
		if (err) {
			if (err.code === 'ENOENT') {
				// if package doesn't exist, we create it here
				data = get_boilerplate(name);
			} else {
				return callback(self._internal_error(err, file, 'error reading'))
			}
		}
		self._normalize_package(data)
		callback(null, data)
	});
}

// synchronize remote package info with the local one
// TODO: readfile called twice
Storage.prototype.update_versions = function(name, newdata, callback) {
	var self = this;
	self._read_create_package(name, function(err, data) {
		if (err) return callback(err);

		var change = false;
		for (var ver in newdata.versions) {
			if (data.versions[ver] == null) {
				var verdata = newdata.versions[ver];

				// why does anyone need to keep that in database?
				delete verdata.readme;

				change = true;
				data.versions[ver] = verdata;
				
				if (verdata.dist && verdata.dist.tarball) {
					var url = utils.parse_tarball_url(
						verdata.dist.__sinopia_orig_tarball || verdata.dist.tarball
					);

					// we do NOT overwrite any existing records
					if (url != null && data._distfiles[url.filename] == null) {
						data._distfiles[url.filename] = {
							url: verdata.dist.__sinopia_orig_tarball || verdata.dist.tarball,
							sha: verdata.dist.shasum,
						};
					}
				}
			}
		}
		for (var tag in newdata['dist-tags']) {
			// if tag is updated to reference latter version, that's fine
			var need_change = 
				(data['dist-tags'][tag] == null) ||
				(!semver.gte(newdata['dist-tags'][tag], data['dist-tags'][tag]));

			if (need_change) {
				change = true;
				data['dist-tags'][tag] = newdata['dist-tags'][tag];
			}
		}
		
		if (change) {
			self._write_package(name, data, callback)
		} else {
			callback();
		}
	});
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
		data['dist-tags'][tag] = version
		cb()
	}, callback)
}

Storage.prototype.add_tarball = function(name, filename) {
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

	var wstream = this.storage.write_stream(name + '/' + filename);

	wstream.on('error', function(err) {
		if (err.code === 'EEXISTS') {
			stream.emit('error', new UError({
				status: 409,
				msg: 'this tarball is already present'
			}));
		} else if (err.code === 'ENOENT') {
			// check if package exists to throw an appropriate message
			self.get_package(name, function(_err, res) {
				if (_err) {
					stream.emit('error', _err);
				} else {
					stream.emit('error', err);
				}
			});
		} else {
			stream.emit('error', err);
		}
	});

	wstream.on('open', function() {
		// re-emitting open because it's handled in storage.js
		stream.emit('open');
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
			}));
			wstream.abort();
		} else {
			wstream.done();
		}
	};
	stream.pipe(wstream);

	return stream;
}

Storage.prototype.get_tarball = function(name, filename, callback) {
	var stream = new mystreams.ReadTarballStream();
	stream.abort = function() {
		rstream.close();
	};

	var rstream = this.storage.read_stream(name + '/' + filename);
	rstream.on('error', function(err) {
		if (err && err.code === 'ENOENT') {
			stream.emit('error', new UError({
				status: 404,
				msg: 'no such file available',
			}));
		} else {
			stream.emit('error', err);
		}
	});
	rstream.on('open', function() {
		// re-emitting open because it's handled in storage.js
		stream.emit('open');
		rstream.pipe(stream);
	});
	return stream;
}

Storage.prototype.get_package = function(name, callback) {
	var self = this
	  , file = name + '/' + info_file

	self.storage.read_json(file, function(err, result) {
		if (err) {
			if (err.code === 'ENOENT') {
				return callback(new UError({
					status: 404,
					msg: 'no such package available'
				}))
			} else {
				return callback(self._internal_error(err, file, 'error reading'))
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
	  , file = name + '/' + info_file
	self.storage.lock_and_read_json(file, function(err, fd, json) {
		self.logger.debug({file: file}, 'locking @{file}')

		function callback() {
			self.logger.debug({file: file}, 'unlocking @{file}')
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
	['versions', 'dist-tags', '_distfiles', '_attachments'].forEach(function(key) {
		if (!utils.is_object(pkg[key])) pkg[key] = {}
	});
	if (typeof(pkg._rev) !== 'string') pkg._rev = '0-0000000000000000'
}

Storage.prototype._write_package = function(name, json, callback) {

	// calculate revision a la couchdb
	if (typeof(json._rev) !== 'string') json._rev = '0-0000000000000000'
	var rev = json._rev.split('-')
	json._rev = ((+rev[0] || 0) + 1) + '-' + crypto.pseudoRandomBytes(16).toString('hex')

	this.storage.write_json(name + '/' + info_file, json, callback)
}

module.exports = Storage;

