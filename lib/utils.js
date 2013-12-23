var assert = require('assert')
  , URL = require('url')

// from normalize-package-data/lib/fixer.js
module.exports.validate_name = function(name) {
	if (typeof(name) !== 'string') return false
	name = name.toLowerCase()
	if (
		name.charAt(0) === "." || // ".bin", etc.
		name.match(/[\/@\s\+%:]/) ||
		name !== encodeURIComponent(name) ||
		name.toLowerCase() === "node_modules" ||
		name.toLowerCase() === "__proto__" ||
		name.toLowerCase() === "package.json" ||
		name.toLowerCase() === "favicon.ico"
	) {
		return false
	} else {
		return true
	}
}

module.exports.is_object = function(obj) {
	return typeof(obj) === 'object' && obj !== null && !Array.isArray(obj)
}

module.exports.validate_metadata = function(object, name) {
	assert(module.exports.is_object(object), 'not a json object')
	assert.equal(object.name, name)

	if (!module.exports.is_object(object['dist-tags'])) {
		object['dist-tags'] = {}
	}

	if (!module.exports.is_object(object['versions'])) {
		object['versions'] = {}
	}

	return object
}

module.exports.parse_tarball_url = function(_url) {
	var url = URL.parse(_url)

	var path = url.path.replace(/^\//, '').split('/')
	if (path.length >= 3 && path[path.length-2] === '-') {
		var filename = path.pop()
		  , pkgpath = '/' + filename // tarball name
		pkgpath = '/' + path.pop() + pkgpath // "-"
		pkgpath = '/' + path.pop() + pkgpath // package.name
	} else {
		return null
	}

	return {
		protocol: url.protocol,
		host: url.host,
		prepath: '/' + path.join('/'),
		pkgpath: pkgpath,
		filename: filename,
	}
}

module.exports.filter_tarball_urls = function(pkg, req, config) {
	function filter(_url) {
		if (!req.headers.host) return _url

		var url = module.exports.parse_tarball_url(_url)
		// weird url, just return it
		if (url == null) return _url

		if (config.url_prefix != null) {
			var result = config.url_prefix.replace(/\/$/, '')
		} else {
			var result = req.protocol + '://' + req.headers.host
		}

		return result + url.pkgpath
	}

	for (var ver in pkg.versions) {
		var dist = pkg.versions[ver].dist
		if (dist != null && dist.tarball != null) {
			dist.__sinopia_orig_tarball = dist.tarball
			dist.tarball = filter(dist.tarball)
		}
	}
	return pkg
}

