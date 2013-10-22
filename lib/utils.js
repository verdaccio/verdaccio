var assert = require('assert');
var URL = require('url');

// from normalize-package-data/lib/fixer.js
module.exports.validate_name = function(name) {
	name = name.toLowerCase();
	if (
		name.charAt(0) === "." || // ".bin", etc.
		name.match(/[\/@\s\+%:]/) ||
		name !== encodeURIComponent(name) ||
		name.toLowerCase() === "node_modules" ||
		name.toLowerCase() === "__proto__" ||
		name.toLowerCase() === "favicon.ico"
	) {
		return false;
	} else {
		return true;
	}
}

module.exports.is_object = function(obj) {
	return typeof(obj) === 'object' && obj !== null && !Array.isArray(obj)
}

module.exports.validate_metadata = function(object, name) {
	assert(module.exports.is_object(object));
	assert.equal(object.name, name);
	
	if (!module.exports.is_object(object['dist-tags'])) {
		object['dist-tags'] = {};
	}
	
	if (!module.exports.is_object(object['versions'])) {
		object['versions'] = {};
	}
	
	return object;
}

module.exports.parse_tarball_url = function(_url) {
	var url = URL.parse(_url);

	var path = url.path.replace(/^\//, '').split('/');
	if (path.length >= 3 && path[path.length-2] === '-') {
		var filename = path.pop();
		var pkgpath = '/' + filename; // tarball name
		pkgpath = '/' + path.pop() + pkgpath; // "-"
		pkgpath = '/' + path.pop() + pkgpath; // package.name
	} else {
		return null;
	}

	return {
		protocol: url.protocol,
		host: url.host,
		prepath: '/' + path.join('/'),
		pkgpath: pkgpath,
		filename: filename,
	};
}

module.exports.filter_tarball_urls = function(pkg, req, config) {
	function filter(_url) {
		if (!req.headers.host) return _url;

		var url = module.exports.parse_tarball_url(_url);
		// weird url, just return it
		if (url == null) return _url;

		if (config.url_prefix != null) {
			var result = config.url_prefix.replace(/\/$/, '');
		} else {
			var result = req.protocol + '://' + req.headers.host;
		}

		return result + url.pkgpath;
	}

	for (var ver in pkg.versions) {
		if (pkg.versions[ver].dist != null
		&&  pkg.versions[ver].dist.tarball != null) {
			pkg.versions[ver].dist.__sinopia_orig_tarball = pkg.versions[ver].dist.tarball;
			pkg.versions[ver].dist.tarball = filter(pkg.versions[ver].dist.tarball);
		}
	}
	return pkg;
}

