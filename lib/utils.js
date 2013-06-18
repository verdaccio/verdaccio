var assert = require('assert');
var URL = require('url');

// from normalize-package-data/lib/fixer.js
module.exports.validate_name = function(name) {
	if (
		name.charAt(0) === "." ||
		name.match(/[\/@\s\+%:]/) ||
		name !== encodeURIComponent(name) ||
		name.toLowerCase() === "node_modules" ||
		name.toLowerCase() === "favicon.ico"
	) {
		return false;
	} else {
		return true;
	}
}

function is_object(obj) {
	return typeof(obj) === 'object' && !Array.isArray(obj);
}

module.exports.validate_metadata = function(object, name) {
	assert(is_object(object));
	assert.equal(object._id, name);
	assert.equal(object.name, name);
	
	if (!is_object(object['dist-tags'])) {
		object['dist-tags'] = {};
	}
	
	if (!is_object(object['versions'])) {
		object['versions'] = {};
	}
	
	return object;
}

module.exports.filter_tarball_urls = function(pkg, req, config) {
	function filter(_url) {
		if (!req.headers.host) return _url;

		var url = URL.parse(_url);
		if (config.url_prefix != null) {
			var result = config.url_prefix.replace(/\/$/, '');
		} else {
			var result = req.protocol + '://' + req.headers.host;
		}

		path = url.path.replace(/^\//, '').split('/');
		if (path.length >= 3 && path[path.length-2] === '-') {
			result += '/' + path[path.length-3]; // package name
			result += '/' + path[path.length-2]; // "-"
			result += '/' + path[path.length-1]; // tarball name
			return result;
		} else {
			// weird url, just return it
			return _url;
		}
	}

	for (var ver in pkg.versions) {
		if (pkg.versions[ver].dist != null
		&&  pkg.versions[ver].dist.tarball != null) {
			pkg.versions[ver].dist.tarball = filter(pkg.versions[ver].dist.tarball);
		}
	}
	return pkg;
}

