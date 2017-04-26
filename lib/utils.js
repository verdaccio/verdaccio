'use strict';

let assert = require('assert');
let Semver = require('semver');
let URL = require('url');
let Logger = require('./logger');

/**
 * Validate a package.
 * @param {*} name
 * @return {Boolean} whether the package is valid or not
 */
function validate_package(name) {
	name = name.split('/', 2);
	if (name.length === 1) {
		// normal package
		return module.exports.validate_name(name[0]);
	} else {
		// scoped package
		return name[0][0] === '@'
				&& module.exports.validate_name(name[0].slice(1))
				&& module.exports.validate_name(name[1]);
	}
}

/**
 * From normalize-package-data/lib/fixer.js
 * @param {*} name  the package name
 * @return {Boolean} whether is valid or not
 */
function validate_name(name) {
	if (typeof(name) !== 'string') {
		return false;
	}
	name = name.toLowerCase();

	// all URL-safe characters and "@" for issue #75
	if (!name.match(/^[-a-zA-Z0-9_.!~*'()@]+$/)
	 || name.charAt(0) === '.' // ".bin", etc.
	 || name.charAt(0) === '-' // "-" is reserved by couchdb
	 || name === 'node_modules'
	 || name === '__proto__'
	 || name === 'package.json'
	 || name === 'favicon.ico'
	) {
		return false;
	} else {
		return true;
	}
}

/**
 * Check whether an element is an Object
 * @param {*} obj the element
 * @return {Boolean}
 */
function is_object(obj) {
	return typeof(obj) === 'object' && obj !== null && !Array.isArray(obj);
}

/**
 * Validate the package metadata, add additional properties whether are missing within
 * the metadata properties.
 * @param {*} object
 * @param {*} name
 * @return {Object} the object with additional properties as dist-tags ad versions
 */
function validate_metadata(object, name) {
	assert(module.exports.is_object(object), 'not a json object');
	assert.equal(object.name, name);

	if (!module.exports.is_object(object['dist-tags'])) {
		object['dist-tags'] = {};
	}

	if (!module.exports.is_object(object['versions'])) {
		object['versions'] = {};
	}

	return object;
}

/**
 * Iterate a packages's versions and filter each original tarbal url.
 * @param {*} pkg
 * @param {*} req
 * @param {*} config
 * @return {String} a filtered package
 */
function filter_tarball_urls(pkg, req, config) {
	/**
	 * Filter a tarball url.
	 * @param {*} _url
	 * @return {String} a parsed url
	 */
	const filter = function(_url) {
		if (!req.headers.host) {
			return _url;
		}
		let filename = URL.parse(_url).pathname.replace(/^.*\//, '');
		let result;
		if (config.url_prefix != null) {
			result = config.url_prefix.replace(/\/$/, '');
		} else {
			result = req.protocol + '://' + req.headers.host;
		}
		return `${result}/${pkg.name.replace(/\//g, '%2f')}/-/${filename}`;
	};

	for (let ver in pkg.versions) {
		let dist = pkg.versions[ver].dist;
		if (dist != null && dist.tarball != null) {
			// dist.__verdaccio_orig_tarball = dist.tarball
			dist.tarball = filter(dist.tarball);
		}
	}
	return pkg;
}

/**
 * Create a tag for a package
 * @param {*} data
 * @param {*} version
 * @param {*} tag
 * @return {Boolean} whether a package has been tagged
 */
function tag_version(data, version, tag) {
	if (tag) {
		if (data['dist-tags'][tag] !== version) {
			if (Semver.parse(version, true)) {
				// valid version - store
				data['dist-tags'][tag] = version;
				return true;
			}
		}
		Logger.logger.warn({ver: version, tag: tag}, 'ignoring bad version @{ver} in @{tag}');
		if (tag && data['dist-tags'][tag]) {
			delete data['dist-tags'][tag];
		}
	}
	return false;
}

/**
 * Gets version from a package object taking into account semver weirdness.
 * @param {*} object
 * @param {*} version
 * @return {String} return the semantic version of a package
 */
function get_version(object, version) {
	// this condition must allow cast
	if (object.versions[version] != null) {
		return object.versions[version];
	}
	try {
		version = Semver.parse(version, true);
		for (let k in object.versions) {
			if (version.compare(Semver.parse(k, true)) === 0) {
				return object.versions[k];
			}
		}
	} catch (err) {
		return undefined;
	}
}

/**
 * Parse an internet address
 * Allow:
		- https:localhost:1234        - protocol + host + port
		- localhost:1234              - host + port
		- 1234                        - port
		- http::1234                  - protocol + port
		- https://localhost:443/      - full url + https
		- http://[::1]:443/           - ipv6
		- unix:/tmp/http.sock         - unix sockets
		- https://unix:/tmp/http.sock - unix sockets (https)
 * @param {*} addr the internet address definition
 * @return {Object|Null} literal object that represent the address parsed
 */
function parse_address(addr) {
	//
	// TODO: refactor it to something more reasonable?
	//
	//        protocol :  //      (  host  )|(    ipv6     ):  port  /
	let m = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(addr);

	if (m) return {
		proto: m[2] || 'http',
		host: m[6] || m[7] || 'localhost',
		port: m[8] || '4873',
	};

	m = /^((https?):(\/\/)?)?unix:(.*)$/.exec(addr);

	if (m) {
		return {
			proto: m[2] || 'http',
			path: m[4],
		};
	}

	return null;
}

/**
 * Function filters out bad semver versions and sorts the array.
 * @param {*} array
 * @return {Array} sorted Array
 */
function semver_sort(array) {
	return array
		.filter(function(x) {
			if (!Semver.parse(x, true)) {
				Logger.logger.warn( {ver: x}, 'ignoring bad version @{ver}' );
				return false;
			}
			return true;
		})
		.sort(Semver.compareLoose)
		.map(String);
}

/**
 * Flatten arrays of tags.
 * @param {*} data
 */
function normalize_dist_tags(data) {
	let sorted;

	if (!data['dist-tags'].latest) {
		// overwrite latest with highest known version based on semver sort
		sorted = module.exports.semver_sort(Object.keys(data.versions));
		if (sorted && sorted.length) {
				data['dist-tags'].latest = sorted.pop();
		}
	}

	for (let tag in data['dist-tags']) {
		if (Array.isArray(data['dist-tags'][tag])) {
			if (data['dist-tags'][tag].length) {
				// sort array
				sorted = module.exports.semver_sort(data['dist-tags'][tag]);
				if (sorted.length) {
						// use highest version based on semver sort
						data['dist-tags'][tag] = sorted.pop();
				}
			} else {
				delete data['dist-tags'][tag];
			}
		} else if (typeof data['dist-tags'][tag] === 'string') {
			if (!Semver.parse(data['dist-tags'][tag], true)) {
				// if the version is invalid, delete the dist-tag entry
				delete data['dist-tags'][tag];
			}
		}
	}
}

module.exports.semver_sort = semver_sort;
module.exports.parse_address = parse_address;
module.exports.get_version = get_version;
module.exports.normalize_dist_tags = normalize_dist_tags;
module.exports.tag_version = tag_version;
module.exports.filter_tarball_urls = filter_tarball_urls;
module.exports.validate_metadata = validate_metadata;
module.exports.is_object = is_object;
module.exports.validate_name = validate_name;
module.exports.validate_package = validate_package;
