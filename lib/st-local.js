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

Storage.prototype.add_package = function(name, metadata, callback) {
	this.storage.create_json(name + '/' + info_file, metadata, function(err) {
		if (err && err.code === 'EEXISTS') {
			return callback(new UError({
				status: 409,
				msg: 'this package is already present'
			}));
		}
		callback();
	});
}

Storage.prototype.add_version = function(name, version, metadata, tag, callback) {
	var self = this;
	self.storage.read_json(name + '/' + info_file, function(err, data) {
		// TODO: race condition
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

