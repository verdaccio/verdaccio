var fs = require('fs');
var semver = require('semver');
var Path = require('path');
var fs_storage = require('./local-fs');
var UError = require('./error').UserError;
var utils = require('./utils');
var mystreams = require('./streams');
var info_file = 'package.json';

//
// Implements Storage interface
// (same for storage.js, local-storage.js, up-storage.js)
//
function Storage(config) {
	if (!(this instanceof Storage)) return new Storage(config);
	this.config = config;
	var path = Path.resolve(Path.dirname(this.config.self_path), this.config.storage);
	this.storage = new fs_storage(path);
	return this;
}

// returns the minimal package file
function get_boilerplate(name) {
	return {
		// standard things
		name: name,
		versions: {},
		'dist-tags': {},

		// our own object
		// type: "filename"->"metadata"
		'_distfiles': {},
	};
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
	this.storage.unlink(name + '/' + info_file, function(err) {
		if (err && err.code === 'ENOENT') {
			return callback(new UError({
				status: 404,
				msg: 'no such package available',
			}));
		}
		callback();
	});
}

Storage.prototype._read_create_package = function(name, callback) {
	var self = this;
	self.storage.read_json(name + '/' + info_file, function(err, data) {
		// TODO: race condition
		if (err) {
			if (err.code === 'ENOENT') {
				// if package doesn't exist, we create it here
				data = get_boilerplate(name);
			} else {
				return callback(err);
			}
		}
		callback(null, data);
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
			self.storage.write_json(name + '/' + info_file, data, callback);
		} else {
			callback();
		}
	});
}

Storage.prototype.add_version = function(name, version, metadata, tag, callback) {
	var self = this;
	self._read_create_package(name, function(err, data) {
		// why does anyone need to keep that in database?
		delete metadata.readme;

		if (err) return callback(err);

		if (data.versions[version] != null) {
			return callback(new UError({
				status: 409,
				msg: 'this version already present'
			}));
		}
		data.versions[version] = metadata;
		data['dist-tags'][tag] = version;
		self.storage.update_json(name + '/' + info_file, data, callback);
	});
}

Storage.prototype.add_tarball = function(name, filename) {
	var stream = new mystreams.UploadTarballStream();
	var _transform = stream._transform;
	var length = 0;
	stream._transform = function(data) {
		length += data.length;
		_transform.apply(stream, arguments);
	};
	
	var self = this;
	if (name === info_file || name === '__proto__') {
		stream.emit('error', new UError({
			status: 403,
			msg: 'can\'t use this filename'
		}));
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
	});
	wstream.on('success', function() {
		// re-emitting open because it's handled in index.js
		stream.emit('success');
	});
	stream.abort = function() {
		wstream.abort();
	};
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
	this.storage.read_json(name + '/' + info_file, function(err, result) {
		if (err && err.code === 'ENOENT') {
			return callback(new UError({
				status: 404,
				msg: 'no such package available'
			}));
		}
		callback.apply(null, arguments);
	});
}

module.exports = Storage;

