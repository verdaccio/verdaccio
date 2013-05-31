var packages = {};

module.exports.create_package = function(name, metadata, callback) {
	if (packages[name] == null) {
		packages[name] = {
			meta: metadata,
			versions: {},
		};
		callback(null, true);
	} else {
		callback(null, false);
	}
}

module.exports.add_version = function(name, version, metadata, callback) {
	if (packages[name] == null) {
		callback(null, false);
	} else {
		packages[name].versions[version] = metadata;
		callback(null, true);
	}
}

module.exports.get_package = function(name, callback) {
	callback(null, packages[name]);
}

