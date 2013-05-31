var store = {};

function create(name, contents, callback) {
	if (store[name] != null) {
		return callback(new Error({code: 'EEXISTS'}));
	}
	store[name] = contents;
	callback();
}

function update(name, contents, callback) {
	if (store[name] == null) {
		return callback(new Error({code: 'ENOENT'}));
	}
	store[name] = contents;
	callback();
}

function read(name, callback) {
	if (store[name] == null) {
		return callback(new Error({code: 'ENOENT'}));
	}
	callback(null, store[name]);
}

module.exports.read_json = read;
module.exports.read = read;
module.exports.create_json = create;
module.exports.create = create;
module.exports.update_json = update;
module.exports.update = update;

