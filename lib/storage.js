var async = require('async');
var semver = require('semver');
var UError = require('./error').UserError;
var local = require('./st-local');
var Proxy = require('./st-proxy');
var utils = require('./utils');

function Storage(config) {
	if (!(this instanceof Storage)) return new Storage(config);

	this.config = config;
	this.uplinks = {};
	for (var p in config.uplinks) {
		this.uplinks[p] = new Proxy(p, config);
	}

	return this;
}

Storage.prototype.add_package = function(name, metadata, callback) {
	local.add_package(name, metadata, callback);
}

Storage.prototype.add_version = function(name, version, metadata, tag, callback) {
	local.add_version(name, version, metadata, tag, callback);
}

Storage.prototype.add_tarball = function(name, filename, stream, callback) {
	local.add_tarball(name, filename, stream, callback);
}

Storage.prototype.get_tarball = function(name, filename, callback) {
	local.get_tarball(name, filename, callback);
}

Storage.prototype.get_package = function(name, callback) {
	var uplinks = [local];
	for (var i in this.uplinks) {
		if (this.config.allow_proxy(name, i)) {
			uplinks.push(this.uplinks[i]);
		}
	}

	var result = {
		name: name,
		versions: {},
		'dist-tags': {},
	};
	var latest;

	async.map(uplinks, function(up, cb) {
		up.get_package(name, function(err, up_res) {
			if (err) return cb();

			var this_version = up_res['dist-tags'].latest;
			if (!semver.gt(latest, this_version) && this_version) {
				latest = this_version;
				var is_latest = true;
			}

			try {
				utils.validate_metadata(up_res, name);
			} catch(err) {
				return cb();
			}

			['versions', 'dist-tags'].forEach(function(key) {
				for (var i in up_res[key]) {
					if (!result[key][i] || is_latest) {
						result[key][i] = up_res[key][i];
					}
				}
			});
			cb();
		});
	}, function(err) {
		if (err) return callback(err);
		if (Object.keys(result.versions).length === 0) {
			return callback(new UError({
				status: 404,
				msg: 'no such package available'
			}));
		}
		callback(null, result);
	});
}

module.exports = Storage;

