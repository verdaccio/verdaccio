var semver = require('semver');
var fs_storage = require('./fs-storage');
var UError = require('./error').UserError;
var info_file = 'package.json';
var fs = require('fs');

function Storage(config) {
	if (!(this instanceof Storage)) return new Storage(config);
	this.config = config;
	this.storage = new fs_storage(this.config.storage);
	return this;
}

// returns the minimal package file
function get_boilerplate(name) {
	return {
		name: name,
		versions: {},
		'dist-tags': {},
	};
}

Storage.prototype.add_package = function(name, metadata, callback) {
	this.storage.create_json(name + '/' + info_file, get_boilerplace(name), function(err) {
		if (err && err.code === 'EEXISTS') {
			return callback(new UError({
				status: 409,
				msg: 'this package is already present'
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
				change = true;
				data.versions[ver] = newdata.versions[ver];
			}
		}
		for (var tag in newdata['dist-tags']) {
			// if tag is updated to reference latter version, that's fine
			var need_change = 
				(data['dist-tags'][tag] == null) ||
				(!semver.gt(newdata['dist-tags'], data['dist-tags'][tag]));

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

Storage.prototype.add_tarball = function(name, filename, stream, callback) {
	var self = this;
	if (name === info_file) {
		return callback(new UError({
			status: 403,
			msg: 'can\'t use this filename'
		}));
	}

	var data = new Buffer(0);
	stream.on('data', function(d) {
		var tmp = data;
		data = new Buffer(tmp.length+d.length);
		tmp.copy(data, 0);
		d.copy(data, tmp.length);
	});
	stream.on('end', function(d) {
		self.storage.create(name + '/' + filename, data, function(err) {
			if (err && err.code === 'EEXISTS') {
				return callback(new UError({
					status: 409,
					msg: 'this tarball is already present'
				}));
			}
			callback.apply(null, arguments);
		});
	});
}

Storage.prototype.get_tarball = function(name, filename, callback) {
	this.storage.read(name + '/' + filename, function(err) {
		if (err && err.code === 'ENOENT') {
			return callback(new UError({
				status: 404,
				msg: 'no such package available'
			}));
		}
		callback.apply(null, arguments);
	});
}

Storage.prototype.get_package = function(name, callback) {
	this.storage.read_json(name + '/' + info_file, function(err) {
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

