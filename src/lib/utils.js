// @flow

import {generateGravatarUrl} from '../utils/user';
import assert from 'assert';
import semver from 'semver';
import YAML from 'js-yaml';
import URL from 'url';
import fs from 'fs';
import _ from 'lodash';
import createError from 'http-errors';
import type {Package, Config} from '@verdaccio/types';
import type {$Request} from 'express';

const Logger = require('./logger');

export const DIST_TAGS = 'dist-tags';

/**
 * Validate a package.
 * @return {Boolean} whether the package is valid or not
 */
function validate_package(name: any): boolean {
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
function validate_name(name: string): boolean {
	if (_.isString(name) === false) {
		return false;
	}
	name = name.toLowerCase();

	// all URL-safe characters and "@" for issue #75
	return !(!name.match(/^[-a-zA-Z0-9_.!~*'()@]+$/)
	 || name.charAt(0) === '.' // ".bin", etc.
	 || name.charAt(0) === '-' // "-" is reserved by couchdb
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
function isObject(obj: any): boolean {
	return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

/**
 * Validate the package metadata, add additional properties whether are missing within
 * the metadata properties.
 * @param {*} object
 * @param {*} name
 * @return {Object} the object with additional properties as dist-tags ad versions
 */
function validate_metadata(object: Package, name: string) {
	assert(isObject(object), 'not a json object');
	assert.equal(object.name, name);

	if (!isObject(object[DIST_TAGS])) {
		object[DIST_TAGS] = {};
	}

	if (!isObject(object['versions'])) {
		object['versions'] = {};
	}

	return object;
}

/**
 * Create base url for registry.
 * @return {String} base registry url
 */
function combineBaseUrl(protocol: string, host: string, prefix?: string): string {
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
function filter_tarball_urls(pkg: Package, req: $Request, config: Config) {
	/**
	 * Filter a tarball url.
	 * @param {*} _url
	 * @return {String} a parsed url
	 */
	const filter = function(_url) {
		if (!req.headers.host) {
			return _url;
		}
		// $FlowFixMe
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
function tag_version(data: Package, version: string, tag: string) {
	if (_.isEmpty(tag) === false) {
		if (data[DIST_TAGS][tag] !== version) {
			if (semver.parse(version, true)) {
				// valid version - store
				data[DIST_TAGS][tag] = version;
				return true;
			}
		}
		Logger.logger.warn({ver: version, tag: tag}, 'ignoring bad version @{ver} in @{tag}');
		if (tag && data[DIST_TAGS][tag]) {
			delete data[DIST_TAGS][tag];
		}
	}
	return false;
}

/**
 * Gets version from a package object taking into account semver weirdness.
 * @return {String} return the semantic version of a package
 */
function get_version(pkg: Package, version: any) {
	// this condition must allow cast
	if (pkg.versions[version] != null) {
		return pkg.versions[version];
	}

	try {
		version = semver.parse(version, true);
		for (let versionItem in pkg.versions) {
			// $FlowFixMe
			if (version.compare(semver.parse(versionItem, true)) === 0) {
				return pkg.versions[versionItem];
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
function parse_address(urlAddress: any) {
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
 * @return {Array} sorted Array
 */
function semverSort(listVersions: Array<string>) {
	return listVersions.filter(function(x) {
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
function normalize_dist_tags(pkg: Package) {
	let sorted;
	if (!pkg[DIST_TAGS].latest) {
		// overwrite latest with highest known version based on semver sort
		sorted = semverSort(Object.keys(pkg.versions));
		if (sorted && sorted.length) {
				pkg[DIST_TAGS].latest = sorted.pop();
		}
	}

	for (let tag in pkg[DIST_TAGS]) {
		if (_.isArray(pkg[DIST_TAGS][tag])) {
			if (pkg[DIST_TAGS][tag].length) {
				// sort array
				// $FlowFixMe
				sorted = semverSort(pkg[DIST_TAGS][tag]);
				if (sorted.length) {
						// use highest version based on semver sort
						pkg[DIST_TAGS][tag] = sorted.pop();
				}
			} else {
				delete pkg[DIST_TAGS][tag];
			}
		} else if (_.isString(pkg[DIST_TAGS][tag] )) {
			if (!semver.parse(pkg[DIST_TAGS][tag], true)) {
				// if the version is invalid, delete the dist-tag entry
				delete pkg[DIST_TAGS][tag];
			}
		}
	}
}

const parseIntervalTable = {
  '': 1000,
  ms: 1,
  s: 1000,
  m: 60*1000,
  h: 60*60*1000,
  d: 86400000,
  w: 7*86400000,
  M: 30*86400000,
  y: 365*86400000,
};

/**
 * Parse an internal string to number
 * @param {*} interval
 * @return {Number}
 */
function parseInterval(interval: any) {
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
function getWebProtocol(req: $Request) {
  return req.get('X-Forwarded-Proto') || req.protocol;
}

const getLatestVersion = function(pkgInfo: Package) {
  return pkgInfo[DIST_TAGS].latest;
};

const ErrorCode = {
  get409: (message: string = 'this package is already present') => {
    return createError(409, message);
  },
  get422: (customMessage?: string) => {
    return createError(422, customMessage || 'bad data');
  },
  get400: (customMessage?: string) => {
    return createError(400, customMessage);
  },
  get500: (customMessage?: string) => {
    return customMessage ? createError(500, customMessage) : createError(500);
  },
  get403: (message: string = 'can\'t use this filename') => {
    return createError(403, message);
  },
  get503: () => {
    return createError(500, 'resource temporarily unavailable');
  },
  get404: (customMessage?: string) => {
    return createError(404, customMessage || 'no such package available');
	},
	getCode: (statusCode: number, customMessage: string) => {
    return createError(statusCode, customMessage);
	},
};

const parseConfigFile = (configPath: string) => YAML.safeLoad(fs.readFileSync(configPath, 'utf8'));

/**
 * Check whether the path already exist.
 * @param {String} path
 * @return {Boolean}
 */
function folder_exists(path: string) {
  try {
    const stat = fs.statSync(path);
    return stat.isDirectory();
  } catch(_) {
    return false;
  }
}

/**
 * Check whether the file already exist.
 * @param {String} path
 * @return {Boolean}
 */
function fileExists(path: string) {
  try {
    const stat = fs.statSync(path);
    return stat.isFile();
  } catch(_) {
    return false;
  }
}

function sortByName(packages: Array<any>) {
  return packages.sort(function(a, b) {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
}

function addScope(scope: string, packageName: string) {
  return `@${scope}/${packageName}`;
}

function deleteProperties(propertiesToDelete: Array<string>, packageInfo: Package) {
  _.forEach(propertiesToDelete, (property) => {
    delete packageInfo[property];
  });

  return packageInfo;
}

function addGravatarSupport(info: any) {
  if (_.isString(_.get(info, 'latest.author.email'))) {
    info.latest.author.avatar = generateGravatarUrl(info.latest.author.email);
  } else {
    // _.get can't guarantee author property exist
    _.set(info, 'latest.author.avatar', generateGravatarUrl());
  }

  if (_.get(info, 'latest.contributors.length', 0) > 0) {
    info.latest.contributors = _.map(info.latest.contributors, (contributor) => {
        if (_.isString(contributor.email)) {
          contributor.avatar = generateGravatarUrl(contributor.email);
        } else {
          contributor.avatar = generateGravatarUrl();
        }

        return contributor;
      }
    );
  }

  return info;
}

export {
	addGravatarSupport,
	deleteProperties,
	addScope,
	sortByName,
	folder_exists,
	fileExists,
	parseInterval,
	semverSort,
	parse_address,
	get_version,
	normalize_dist_tags,
	tag_version,
	combineBaseUrl,
	filter_tarball_urls,
	validate_metadata,
	isObject,
	validate_name,
	validate_package,
	getWebProtocol,
	getLatestVersion,
	ErrorCode,
	parseConfigFile,
};
