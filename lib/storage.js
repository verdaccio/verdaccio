var async = require('async');
var semver = require('semver');
var UError = require('./error').UserError;
var Local = require('./st-local');
var Proxy = require('./st-proxy');
var utils = require('./utils');

function Storage(config) {
	if (!(this instanceof Storage)) return new Storage(config);

	this.config = config;
	this.uplinks = {};
	for (var p in config.uplinks) {
		this.uplinks[p] = new Proxy(p, config);
	}
	this.local = new Local(config);

	return this;
}

Storage.prototype.add_package = function(name, metadata, callback) {
	var self = this;
	
	var uplinks = [];
	for (var i in this.uplinks) {
		if (this.config.allow_proxy(name, i)) {
			uplinks.push(this.uplinks[i]);
		}
	}

	async.map(uplinks, function(up, cb) {
		up.get_package(name, function(err, res) {
			cb(null, [err, res]);
		});
	}, function(err, results) {
		for (var i=0; i<results.length; i++) {
			// checking error
			// if uplink fails with a status other than 404, we report failure
			if (results[i][0] != null) {
				if (results[i][0].status !== 404) {
					return callback(new UError({
						status: 503,
						msg: 'one of the uplinks is down, refuse to publish'
					}));
				}
			}

			// checking package
			if (results[i][1] != null) {
				return callback(new UError({
					status: 409,
					msg: 'this package is already present'
				}));
			}
		}
		
		self.local.add_package(name, metadata, callback);
	});
}

Storage.prototype.add_version = function(name, version, metadata, tag, callback) {
	this.local.add_version(name, version, metadata, tag, callback);
}

Storage.prototype.add_tarball = function(name, filename, stream, callback) {
	this.local.add_tarball(name, filename, stream, callback);
}

Storage.prototype.get_tarball = function(name, filename, callback) {
	// if someone requesting tarball, it means that we should already have some
	// information about it, so fetching package info is unnecessary

	// trying local first
	this.local.get_tarball(name, filename, function(err, results) {
		if (err && err.status !== 404) return callback(err);
		if (!err && results != null) return callback(err, results);


return callback(err, results);
/*TODO:// local reported 404
		this.local.get_package(name, function(err, info) {
			if (err) return callback(err);

			
		});*/
	});
}

Storage.prototype.get_package = function(name, callback) {
	var self = this;
	var uplinks = [this.local];
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
	var exists = false;
	var latest;

	async.map(uplinks, function(up, cb) {
		up.get_package(name, function(err, up_res) {
			if (err) return cb();

			try {
				utils.validate_metadata(up_res, name);
			} catch(err) {
				return cb();
			}

			var this_version = up_res['dist-tags'].latest;
			if (!semver.gt(latest, this_version) && this_version) {
				latest = this_version;
				var is_latest = true;
			}

			['versions', 'dist-tags'].forEach(function(key) {
				for (var i in up_res[key]) {
					if (!result[key][i] || is_latest) {
						result[key][i] = up_res[key][i];
					}
				}
			});

			// if we got to this point, assume that the correct package exists
			// on the uplink
			exists = true;
			cb();
		});
	}, function(err) {
		if (err) return callback(err);
		if (!exists) {
			return callback(new UError({
				status: 404,
				msg: 'no such package available'
			}));
		}
		callback(null, result);

		self.local.update_versions(name, result, function(){});
	});
}

module.exports = Storage;

