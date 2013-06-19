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

function write(dest, data, cb) {
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
		write(name, contents, callback);
	});
}

function update(name, contents, callback) {
	fs.exists(name, function(exists) {
		if (!exists) return callback(new Error({code: 'ENOENT'}));
		write(name, contents, callback);
	});
}

function read(name, callback) {
	fs.readFile(name, callback);
}

function Storage(path) {
	this.path = path;
	try {
		fs.mkdirSync(path);
		console.log('created new packages directory: ', path);
	} catch(err) {
		if (err.code !== 'EEXIST') throw new Error(err);
	}
}

Storage.prototype.read = function(name, cb) {
	read(this.path + '/' + name, cb);
}

Storage.prototype.read_json = function(name, cb) {
	read(this.path + '/' + name, function(err, res) {
		if (err) return cb(err);
		cb(null, JSON.parse(res));
	});
}

Storage.prototype.create = function(name, value, cb) {
	create(this.path + '/' + name, value, cb);
}

Storage.prototype.create_json = function(name, value, cb) {
	create(this.path + '/' + name, JSON.stringify(value), cb);
}

Storage.prototype.update = function(name, value, cb) {
	update(this.path + '/' + name, value, cb);
}

Storage.prototype.update_json = function(name, value, cb) {
	update(this.path + '/' + name, JSON.stringify(value), cb);
}

Storage.prototype.write = function(name, value, cb) {
	write(this.path + '/' + name, value, cb);
}

Storage.prototype.write_json = function(name, value, cb) {
	write(this.path + '/' + name, JSON.stringify(value, null, '\t'), cb);
}

module.exports = Storage;

