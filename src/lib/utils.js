'use strict';

const assert = require('assert');
const semver = require('semver');
const YAML = require('js-yaml');
const URL = require('url');
const fs = require('fs');
const _ = require('lodash');
const Logger = require('./logger');
const createError = require('http-errors');

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
	if (_.isString(name) === false) {
		return false;
	}
	name = name.toLowerCase();

	 /**
   * Some context about the first regex
   * - npm used to have a different tarball naming system.
   * eg: http://registry.npmjs.com/thirty-two
   * https://registry.npmjs.org/thirty-two/-/thirty-two@0.0.1.tgz
   * The file name thirty-two@0.0.1.tgz, the version and the pkg name was separated by an at (@)
   * while nowadays the naming system is based in dashes
   * https://registry.npmjs.org/verdaccio/-/verdaccio-1.4.0.tgz
   *
   * more info here: https://github.com/rlidwka/sinopia/issues/75
   */
	return !(!name.match(/^[-a-zA-Z0-9_.!~*'()@]+$/)
	 || name.charAt(0) === '.' // ".bin", etc.
	 || name === 'node_modules'
	 || name === '__proto__'
	 || name === 'package.json'
	 || name === 'favicon.ico'
	);
}

/**
 * Check whether an element is an Object
 * @param {*} obj the element
 * @return {Boolean}
 */
function isObject(obj) {
	return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

/**
 * Validate the package metadata, add additional properties whether are missing within
 * the metadata properties.
 * @param {*} object
 * @param {*} name
 * @return {Object} the object with additional properties as dist-tags ad versions
 */
function validate_metadata(object, name) {
	assert(isObject(object), 'not a json object');
	assert.equal(object.name, name);

	if (!isObject(object['dist-tags'])) {
		object['dist-tags'] = {};
	}

	if (!isObject(object['versions'])) {
		object['versions'] = {};
	}

	return object;
}

/**
 * Create base url for registry.
 * @param {String} protocol
 * @param {String} host
 * @param {String} prefix
 * @return {String} base registry url
 */
function combineBaseUrl(protocol, host, prefix) {
	let result = `${protocol}://${host}`;

	if (prefix) {
		prefix = prefix.replace(/\/$/, '');

		result = (prefix.indexOf('/') === 0)
			? `${result}${prefix}`
			: prefix;
	}

	return result;
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
		const filename = URL.parse(_url).pathname.replace(/^.*\//, '');
		const base = combineBaseUrl(getWebProtocol(req), req.headers.host, config.url_prefix);

		return `${base}/${pkg.name.replace(/\//g, '%2f')}/-/${filename}`;
	};

	for (let ver in pkg.versions) {
		if (Object.prototype.hasOwnProperty.call(pkg.versions, ver)) {
			const dist = pkg.versions[ver].dist;
			if (_.isNull(dist) === false && _.isNull(dist.tarball) === false) {
				dist.tarball = filter(dist.tarball);
			}
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
			if (semver.parse(version, true)) {
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
		version = semver.parse(version, true);
		for (let k in object.versions) {
			if (version.compare(semver.parse(k, true)) === 0) {
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
 * @param {*} urlAddress the internet address definition
 * @return {Object|Null} literal object that represent the address parsed
 */
function parse_address(urlAddress) {
	//
	// TODO: refactor it to something more reasonable?
	//
	//        protocol :  //      (  host  )|(    ipv6     ):  port  /
	let urlPattern = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(urlAddress);

	if (urlPattern) {
	  return {
      proto: urlPattern[2] || 'http',
      host: urlPattern[6] || urlPattern[7] || 'localhost',
      port: urlPattern[8] || '4873',
    };
  }

	urlPattern = /^((https?):(\/\/)?)?unix:(.*)$/.exec(urlAddress);

	if (urlPattern) {
		return {
			proto: urlPattern[2] || 'http',
			path: urlPattern[4],
		};
	}

	return null;
}

/**
 * Function filters out bad semver versions and sorts the array.
 * @param {*} array
 * @return {Array} sorted Array
 */
function semverSort(array) {
	return array
		.filter(function(x) {
			if (!semver.parse(x, true)) {
				Logger.logger.warn( {ver: x}, 'ignoring bad version @{ver}' );
				return false;
			}
			return true;
		})
		.sort(semver.compareLoose)
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
		sorted = semverSort(Object.keys(data.versions));
		if (sorted && sorted.length) {
				data['dist-tags'].latest = sorted.pop();
		}
	}

	for (let tag in data['dist-tags']) {
		if (_.isArray(data['dist-tags'][tag])) {
			if (data['dist-tags'][tag].length) {
				// sort array
				sorted = semverSort(data['dist-tags'][tag]);
				if (sorted.length) {
						// use highest version based on semver sort
						data['dist-tags'][tag] = sorted.pop();
				}
			} else {
				delete data['dist-tags'][tag];
			}
		} else if (_.isString(data['dist-tags'][tag] )) {
			if (!semver.parse(data['dist-tags'][tag], true)) {
				// if the version is invalid, delete the dist-tag entry
				delete data['dist-tags'][tag];
			}
		}
	}
}

const parseIntervalTable = {
  '': 1000,
  'ms': 1,
  's': 1000,
  'm': 60*1000,
  'h': 60*60*1000,
  'd': 86400000,
  'w': 7*86400000,
  'M': 30*86400000,
  'y': 365*86400000,
};

/**
 * Parse an internal string to number
 * @param {*} interval
 * @return {Number}
 */
function parseInterval(interval) {
  if (typeof(interval) === 'number') {
    return interval * 1000;
  }
  let result = 0;
  let last_suffix = Infinity;
  interval.split(/\s+/).forEach(function(x) {
    if (!x) return;
    let m = x.match(/^((0|[1-9][0-9]*)(\.[0-9]+)?)(ms|s|m|h|d|w|M|y|)$/);
    if (!m
      || parseIntervalTable[m[4]] >= last_suffix
      || (m[4] === '' && last_suffix !== Infinity)) {
      throw Error('invalid interval: ' + interval);
    }
    last_suffix = parseIntervalTable[m[4]];
    result += Number(m[1]) * parseIntervalTable[m[4]];
  });
  return result;
}

/**
 * Detect running protocol (http or https)
 * @param {*} req
 * @return {String}
 */
function getWebProtocol(req) {
  return req.get('X-Forwarded-Proto') || req.protocol;
}

const getLatestVersion = function(pkgInfo) {
  return pkgInfo['dist-tags'].latest;
};

const ErrorCode = {
  get409: () => {
    return createError(409, 'this package is already present');
  },
  get422: (customMessage) => {
    return createError(422, customMessage || 'bad data');
  },
  get400: (customMessage) => {
    return createError(400, customMessage);
  },
  get500: () => {
    return createError(500);
  },
  get403: () => {
    return createError(403, 'can\'t use this filename');
  },
  get503: () => {
    return createError(500, 'resource temporarily unavailable');
  },
  get404: (customMessage) => {
    return createError(404, customMessage || 'no such package available');
  },
};

const parseConfigFile = (config_path) => YAML.safeLoad(fs.readFileSync(config_path, 'utf8'));

module.exports.parseInterval = parseInterval;
module.exports.semver_sort = semverSort;
module.exports.parse_address = parse_address;
module.exports.get_version = get_version;
module.exports.normalize_dist_tags = normalize_dist_tags;
module.exports.tag_version = tag_version;
module.exports.combineBaseUrl = combineBaseUrl;
module.exports.filter_tarball_urls = filter_tarball_urls;
module.exports.validate_metadata = validate_metadata;
module.exports.is_object = isObject;
module.exports.validate_name = validate_name;
module.exports.validate_package = validate_package;
module.exports.getWebProtocol = getWebProtocol;
module.exports.getLatestVersion = getLatestVersion;
module.exports.ErrorCode = ErrorCode;
module.exports.parseConfigFile = parseConfigFile;
