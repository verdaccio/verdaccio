var async = require('async');
var semver = require('semver');
var UError = require('./error').UserError;
var Local = require('./local-storage');
var Proxy = require('./up-storage');
var mystreams = require('./streams');
var utils = require('./utils');

//
// Implements Storage interface
// (same for storage.js, local-storage.js, up-storage.js)
//
function Storage(config) {
	if (!(this instanceof Storage)) return new Storage(config);

	this.config = config;

	// we support a number of uplinks, but only one local storage
	// Proxy and Local classes should have similar API interfaces
	this.uplinks = {};
	for (var p in config.uplinks) {
		this.uplinks[p] = new Proxy(config.uplinks[p], config);
	}
	this.local = new Local(config);

	return this;
}

//
// Add a {name} package to a system
//
// Function checks if package with the same name is available from uplinks.
// If it isn't, we create package metadata locally and send requests to do
// the same to all uplinks with write access. If all actions succeeded, we
// report success, if just one uplink fails, we abort.
//
// TODO: if a package is uploaded to uplink1, but upload to uplink2 fails,
// we report failure, but package is not removed from uplink1. This might
// require manual intervention.
//
// Used storages: local (write) && uplinks (proxy_access, r/o) &&
//                uplinks (proxy_publish, write)
//
Storage.prototype.add_package = function(name, metadata, callback) {
	var self = this;

	var uplinks = [];
	for (var i in self.uplinks) {
		if (self.config.proxy_access(name, i)) {
			uplinks.push(self.uplinks[i]);
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
		
		uplinks = [];
		for (var i in self.uplinks) {
			if (self.config.proxy_publish(name, i)) {
				uplinks.push(self.uplinks[i]);
			}
		}
		async.map(uplinks, function(up, cb) {
			up.add_package(name, metadata, cb);
		}, function(err, results) {
			if (err) {
				return callback(new UError({
					status: 503,
					msg: 'can\'t upload to one of the uplinks, refuse to publish'
				}));
			}
			self.local.add_package(name, metadata, callback);
		});
	});
}

//
// Add a new version of package {name} to a system
//
// Function uploads a new package version to all uplinks with write access
// and if everything succeeded it adds it locally.
//
// TODO: if a package is uploaded to uplink1, but upload to uplink2 fails,
// we report failure, but package is not removed from uplink1. This might
// require manual intervention.
//
// Used storages: local (write) && uplinks (proxy_publish, write)
//
Storage.prototype.add_version = function(name, version, metadata, tag, callback) {
	var self = this;

	var uplinks = [];
	for (var i in self.uplinks) {
		if (self.config.proxy_publish(name, i)) {
			uplinks.push(self.uplinks[i]);
		}
	}
	async.map(uplinks, function(up, cb) {
		up.add_version(name, version, metadata, tag, cb);
	}, function(err, results) {
		if (err) {
			return callback(new UError({
				status: 503,
				msg: 'can\'t upload to one of the uplinks, refuse to publish'
			}));
		}
		self.local.add_version(name, version, metadata, tag, callback);
	});
}

//
// Remove a package from a system
//
// Function removes a package from local storage and all uplinks with
// write access.
//
// TODO: currently it works only locally
//
// TODO: if a package is uploaded to uplink1, but upload to uplink2 fails,
// we report failure, but package is not removed from uplink1. This might
// require manual intervention.
//
// Used storages: local (write) && uplinks (proxy_publish, write)
//
Storage.prototype.remove_package = function(name, callback) {
	return this.local.remove_package(name, callback);
}

//
// Upload a tarball for {name} package
//
// Function is syncronous and returns a WritableStream
//
// Function uploads a tarball to all uplinks with write access and to
// local storage in parallel with a speed of a slowest pipe. It reports
// success if all uploads succeed.
//
// Used storages: local (write) && uplinks (proxy_publish, write)
//
Storage.prototype.add_tarball = function(name, filename) {
	var stream = new mystreams.UploadTarballStream();
	
	var self = this;
	var upstreams = [];
	var localstream = self.local.add_tarball(name, filename);

	upstreams.push(localstream);
	for (var i in self.uplinks) {
		if (self.config.proxy_publish(name, i)) {
			upstreams.push(self.uplinks[i].add_tarball(name, filename));
		}
	}

	function bail(err) {
		upstreams.forEach(function(upstream) {
			upstream.abort();
		});
	}

	upstreams.forEach(function(upstream) {
		stream.pipe(upstream);
	
		upstream.on('error', function(err) {
			if (err.code === 'EEXISTS') {
				stream.emit('error', new UError({
					status: 409,
					msg: 'this tarball is already present'
				}));
			} else if (!stream.status && upstream !== localstream) {
				stream.emit('error', new UError({
					status: 503,
					msg: 'one or more uplinks are unreachable'
				}));
			} else {
				stream.emit('error', err);
			}
			bail(err);
		});
		upstream.on('success', function() {
			upstream._sinopia_success = true;
			if (upstreams.filter(function(upstream) {
				return !upstream._sinopia_success;
			}).length === 0) {
				stream.emit('success');
			}
		});
	});

	stream.abort = function() {
		bail();
	};
	stream.done = function() {
		upstreams.forEach(function(upstream) {
			upstream.done();
		});
	};

	return stream;
}

//
// Get a tarball from a storage for {name} package
//
// Function is syncronous and returns a ReadableStream
//
// Function tries to read tarball locally, if it fails then it reads package
// information in order to figure out where we can get this tarball from
//
// Used storages: local || uplink (just one)
//
Storage.prototype.get_tarball = function(name, filename) {
	var stream = new mystreams.ReadTarballStream();
	stream.abort = function() {};
	
	var self = this;

	// if someone requesting tarball, it means that we should already have some
	// information about it, so fetching package info is unnecessary

	// trying local first
	var rstream = self.local.get_tarball(name, filename);
	var is_open = false;
	rstream.on('error', function(err) {
		if (is_open || err.status !== 404) {
			return stream.emit('error', err);
		}

		// local reported 404
		var err404 = err;
		var uplink = null;
		rstream.abort();
		rstream = null; // gc

		self.local.get_package(name, function(err, info) {
			if (err) return stream.emit('error', err);

			if (info._distfiles[filename] == null) {
				return stream.emit('error', err404);
			}

			var file = info._distfiles[filename];
			var uplink = null;
			for (var p in self.uplinks) {
				if (self.uplinks[p].can_fetch_url(file.url)) {
					uplink = self.uplinks[p];
				}
			}
			if (uplink == null) {
				uplink = new Proxy({
					url: file.url,
					_autogenerated: true,
				}, self.config);
			}

			var savestream = self.local.add_tarball(name, filename);
			savestream.on('error', function(err) {
				savestream.abort();
				stream.emit('error', err);
			});
			savestream.on('open', function() {
				var rstream2 = uplink.get_url(file.url);
				rstream2.on('error', function(err) {
					savestream.abort();
					stream.emit('error', err);
				});
				rstream2.on('end', function() {
					savestream.done();
				});

				// XXX: check, what would happen if client disconnects?
				rstream2.pipe(stream);
				rstream2.pipe(savestream);
			});
		});
	});
	rstream.on('open', function() {
		is_open = true;
		rstream.pipe(stream);
	});
	return stream;
}

//
// Retrieve a package metadata for {name} package
//
// Function invokes local.get_package and uplink.get_package for every
// uplink with proxy_access rights against {name} and combines results
// into one json object
//
// Used storages: local && uplink (proxy_access)
//
Storage.prototype.get_package = function(name, callback) {
	var self = this;
	var uplinks = [this.local];
	for (var i in this.uplinks) {
		if (this.config.proxy_access(name, i)) {
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
			if (err) {
				if (up === self.local && (!err.status || err.status >= 500)) {
					// report internal errors right away
					return cb(err)
				} else {
					return cb()
				}
			}

			if (up === self.local) {
				// file exists in local repo
				exists = true;
			}

			try {
				utils.validate_metadata(up_res, name);
			} catch(err) {
				return cb();
			}

			var this_version = up_res['dist-tags'].latest;
			if (latest == null
			|| (!semver.gt(latest, this_version) && this_version)) {
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

		self.local.update_versions(name, result, function(err) {
			if (err) return callback(err);
			callback(null, result);
		});
	});
}

module.exports = Storage;

