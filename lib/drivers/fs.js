var fs = require('fs');
var Path = require('path');

function make_directories(dest, cb) {
	var dir = Path.dirname(dest);
	if (dir === '.' || dir === '..') return cb();
	fs.mkdir(dir, function(err) {
		if (err && err.code === 'ENOENT') {
			make_directories(dir, function() {
				fs.mkdir(dir, cb);
			})
		} else {
			cb();
		}
	});
}

function write_file(dest, data, cb) {
	var safe_write = function(cb) {
		fs.writeFile(dest, data, cb);
	}

	safe_write(function(err) {
		if (err && err.code === 'ENOENT') {
			make_directories(dest, function() {
				safe_write(cb);
			})
		} else {
			cb(err);
		}
	});
}

function create(name, contents, callback) {
	fs.exists(name, function(exists) {
		if (exists) return callback(new Error({code: 'EEXISTS'}));
		write_file(name, contents, callback);
	});
}

function update(name, contents, callback) {
	fs.exists(name, function(exists) {
		if (!exists) return callback(new Error({code: 'ENOENT'}));
		write_file(name, contents, callback);
	});
}

function read(name, callback) {
	fs.readFile(name, callback);
}

module.exports.read = read;
module.exports.create = create;
module.exports.update = update;

