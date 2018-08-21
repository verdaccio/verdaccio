'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseReadme = exports.parseConfigFile = exports.ErrorCode = exports.getLatestVersion = exports.getWebProtocol = exports.validate_package = exports.validateName = exports.isObject = exports.validate_metadata = exports.combineBaseUrl = exports.tagVersion = exports.getVersion = exports.parse_address = exports.semverSort = exports.parseInterval = exports.fileExists = exports.folder_exists = exports.sortByName = exports.addScope = exports.deleteProperties = exports.addGravatarSupport = exports.DIST_TAGS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getUserAgent = getUserAgent;
exports.buildBase64Buffer = buildBase64Buffer;
exports.extractTarballFromUrl = extractTarballFromUrl;
exports.convertDistRemoteToLocalTarballUrls = convertDistRemoteToLocalTarballUrls;
exports.getLocalRegistryTarballUri = getLocalRegistryTarballUri;
exports.normalizeDistTags = normalizeDistTags;
exports.buildToken = buildToken;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _asciidoctor = require('asciidoctor.js');

var _asciidoctor2 = _interopRequireDefault(_asciidoctor);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _constants = require('./constants');

var _user = require('../utils/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Logger = require('./logger');
const pkginfo = require('pkginfo')(module); // eslint-disable-line no-unused-vars
const pkgVersion = module.exports.version;
const pkgName = module.exports.name;

const DIST_TAGS = exports.DIST_TAGS = 'dist-tags';

function getUserAgent() {
  (0, _assert2.default)(_lodash2.default.isString(pkgName));
  (0, _assert2.default)(_lodash2.default.isString(pkgVersion));
  return `${pkgName}/${pkgVersion}`;
}

function buildBase64Buffer(payload) {
  return new Buffer(payload, 'base64');
}

/**
 * Validate a package.
 * @return {Boolean} whether the package is valid or not
 */
function validate_package(name) {
  name = name.split('/', 2);
  if (name.length === 1) {
    // normal package
    return validateName(name[0]);
  } else {
    // scoped package
    return name[0][0] === '@' && validateName(name[0].slice(1)) && validateName(name[1]);
  }
}

/**
 * From normalize-package-data/lib/fixer.js
 * @param {*} name  the package name
 * @return {Boolean} whether is valid or not
 */
function validateName(name) {
  if (_lodash2.default.isString(name) === false) {
    return false;
  }
  name = name.toLowerCase();

  // all URL-safe characters and "@" for issue #75
  return !(!name.match(/^[-a-zA-Z0-9_.!~*'()@]+$/) || name.charAt(0) === '.' || // ".bin", etc.
  name.charAt(0) === '-' || // "-" is reserved by couchdb
  name === 'node_modules' || name === '__proto__' || name === 'package.json' || name === 'favicon.ico');
}

/**
 * Check whether an element is an Object
 * @param {*} obj the element
 * @return {Boolean}
 */
function isObject(obj) {
  return _lodash2.default.isObject(obj) && _lodash2.default.isNull(obj) === false && _lodash2.default.isArray(obj) === false;
}

/**
 * Validate the package metadata, add additional properties whether are missing within
 * the metadata properties.
 * @param {*} object
 * @param {*} name
 * @return {Object} the object with additional properties as dist-tags ad versions
 */
function validate_metadata(object, name) {
  (0, _assert2.default)(isObject(object), 'not a json object');
  _assert2.default.equal(object.name, name);

  if (!isObject(object[DIST_TAGS])) {
    object[DIST_TAGS] = {};
  }

  if (!isObject(object['versions'])) {
    object['versions'] = {};
  }

  if (!isObject(object['time'])) {
    object['time'] = {};
  }

  return object;
}

/**
 * Create base url for registry.
 * @return {String} base registry url
 */
function combineBaseUrl(protocol, host, prefix) {
  let result = `${protocol}://${host}`;

  if (prefix) {
    prefix = prefix.replace(/\/$/, '');

    result = prefix.indexOf('/') === 0 ? `${result}${prefix}` : prefix;
  }

  return result;
}

function extractTarballFromUrl(url) {
  // $FlowFixMe
  return _url2.default.parse(url).pathname.replace(/^.*\//, '');
}

/**
 * Iterate a packages's versions and filter each original tarball url.
 * @param {*} pkg
 * @param {*} req
 * @param {*} config
 * @return {String} a filtered package
 */
function convertDistRemoteToLocalTarballUrls(pkg, req, urlPrefix) {
  for (let ver in pkg.versions) {
    if (Object.prototype.hasOwnProperty.call(pkg.versions, ver)) {
      const distName = pkg.versions[ver].dist;

      if (_lodash2.default.isNull(distName) === false && _lodash2.default.isNull(distName.tarball) === false) {
        distName.tarball = getLocalRegistryTarballUri(distName.tarball, pkg.name, req, urlPrefix);
      }
    }
  }
  return pkg;
}

/**
 * Filter a tarball url.
 * @param {*} uri
 * @return {String} a parsed url
 */
function getLocalRegistryTarballUri(uri, pkgName, req, urlPrefix) {
  const currentHost = req.headers.host;

  if (!currentHost) {
    return uri;
  }
  const tarballName = extractTarballFromUrl(uri);
  const domainRegistry = combineBaseUrl(getWebProtocol(req), req.headers.host, urlPrefix);

  return `${domainRegistry}/${pkgName.replace(/\//g, '%2f')}/-/${tarballName}`;
}

/**
 * Create a tag for a package
 * @param {*} data
 * @param {*} version
 * @param {*} tag
 * @return {Boolean} whether a package has been tagged
 */
function tagVersion(data, version, tag) {
  if (tag) {
    if (data[DIST_TAGS][tag] !== version) {
      if (_semver2.default.parse(version, true)) {
        // valid version - store
        data[DIST_TAGS][tag] = version;
        return true;
      }
    }
  }
  return false;
}

/**
 * Gets version from a package object taking into account semver weirdness.
 * @return {String} return the semantic version of a package
 */
function getVersion(pkg, version) {
  // this condition must allow cast
  if (pkg.versions[version] != null) {
    return pkg.versions[version];
  }

  try {
    version = _semver2.default.parse(version, true);
    for (let versionItem in pkg.versions) {
      // $FlowFixMe
      if (version.compare(_semver2.default.parse(versionItem, true)) === 0) {
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
function parse_address(urlAddress) {
  //
  // TODO: refactor it to something more reasonable?
  //
  //        protocol :  //      (  host  )|(    ipv6     ):  port  /
  let urlPattern = /^((https?):(\/\/)?)?((([^\/:]*)|\[([^\[\]]+)\]):)?(\d+)\/?$/.exec(urlAddress);

  if (urlPattern) {
    return {
      proto: urlPattern[2] || 'http',
      host: urlPattern[6] || urlPattern[7] || _constants.DEFAULT_DOMAIN,
      port: urlPattern[8] || _constants.DEFAULT_PORT
    };
  }

  urlPattern = /^((https?):(\/\/)?)?unix:(.*)$/.exec(urlAddress);

  if (urlPattern) {
    return {
      proto: urlPattern[2] || 'http',
      path: urlPattern[4]
    };
  }

  return null;
}

/**
 * Function filters out bad semver versions and sorts the array.
 * @return {Array} sorted Array
 */
function semverSort(listVersions) {
  return listVersions.filter(function (x) {
    if (!_semver2.default.parse(x, true)) {
      Logger.logger.warn({ ver: x }, 'ignoring bad version @{ver}');
      return false;
    }
    return true;
  }).sort(_semver2.default.compareLoose).map(String);
}

/**
 * Flatten arrays of tags.
 * @param {*} data
 */
function normalizeDistTags(pkg) {
  let sorted;
  if (!pkg[DIST_TAGS].latest) {
    // overwrite latest with highest known version based on semver sort
    sorted = semverSort(Object.keys(pkg.versions));
    if (sorted && sorted.length) {
      pkg[DIST_TAGS].latest = sorted.pop();
    }
  }

  for (let tag in pkg[DIST_TAGS]) {
    if (_lodash2.default.isArray(pkg[DIST_TAGS][tag])) {
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
    } else if (_lodash2.default.isString(pkg[DIST_TAGS][tag])) {
      if (!_semver2.default.parse(pkg[DIST_TAGS][tag], true)) {
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
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 86400000,
  w: 7 * 86400000,
  M: 30 * 86400000,
  y: 365 * 86400000
};

/**
 * Parse an internal string to number
 * @param {*} interval
 * @return {Number}
 */
function parseInterval(interval) {
  if (typeof interval === 'number') {
    return interval * 1000;
  }
  let result = 0;
  let last_suffix = Infinity;
  interval.split(/\s+/).forEach(function (x) {
    if (!x) return;
    let m = x.match(/^((0|[1-9][0-9]*)(\.[0-9]+)?)(ms|s|m|h|d|w|M|y|)$/);
    if (!m || parseIntervalTable[m[4]] >= last_suffix || m[4] === '' && last_suffix !== Infinity) {
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

const getLatestVersion = function (pkgInfo) {
  return pkgInfo[DIST_TAGS].latest;
};

const ErrorCode = {
  getConflict: (message = 'this package is already present') => {
    return (0, _httpErrors2.default)(_constants.HTTP_STATUS.CONFLICT, message);
  },
  getBadData: customMessage => {
    return (0, _httpErrors2.default)(_constants.HTTP_STATUS.BAD_DATA, customMessage || 'bad data');
  },
  getBadRequest: customMessage => {
    return (0, _httpErrors2.default)(_constants.HTTP_STATUS.BAD_REQUEST, customMessage);
  },
  getInternalError: customMessage => {
    return customMessage ? (0, _httpErrors2.default)(_constants.HTTP_STATUS.INTERNAL_ERROR, customMessage) : (0, _httpErrors2.default)(_constants.HTTP_STATUS.INTERNAL_ERROR);
  },
  getForbidden: (message = 'can\'t use this filename') => {
    return (0, _httpErrors2.default)(_constants.HTTP_STATUS.FORBIDDEN, message);
  },
  getServiceUnavailable: (message = _constants.API_ERROR.RESOURCE_UNAVAILABLE) => {
    return (0, _httpErrors2.default)(_constants.HTTP_STATUS.SERVICE_UNAVAILABLE, message);
  },
  getNotFound: customMessage => {
    return (0, _httpErrors2.default)(_constants.HTTP_STATUS.NOT_FOUND, customMessage || _constants.API_ERROR.NO_PACKAGE);
  },
  getCode: (statusCode, customMessage) => {
    return (0, _httpErrors2.default)(statusCode, customMessage);
  }
};

const parseConfigFile = configPath => _jsYaml2.default.safeLoad(_fs2.default.readFileSync(configPath, 'utf8'));

/**
 * Check whether the path already exist.
 * @param {String} path
 * @return {Boolean}
 */
function folder_exists(path) {
  try {
    const stat = _fs2.default.statSync(path);
    return stat.isDirectory();
  } catch (_) {
    return false;
  }
}

/**
 * Check whether the file already exist.
 * @param {String} path
 * @return {Boolean}
 */
function fileExists(path) {
  try {
    const stat = _fs2.default.statSync(path);
    return stat.isFile();
  } catch (_) {
    return false;
  }
}

function sortByName(packages) {
  return packages.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
}

function addScope(scope, packageName) {
  return `@${scope}/${packageName}`;
}

function deleteProperties(propertiesToDelete, objectItem) {
  _lodash2.default.forEach(propertiesToDelete, property => {
    delete objectItem[property];
  });

  return objectItem;
}

function addGravatarSupport(pkgInfo) {
  const pkgInfoCopy = _extends({}, pkgInfo);
  const author = _lodash2.default.get(pkgInfo, 'latest.author', null);
  const contributors = _lodash2.default.get(pkgInfo, 'latest.contributors', []);
  const maintainers = _lodash2.default.get(pkgInfo, 'latest.maintainers', []);

  // for author.
  if (author && _lodash2.default.isObject(author)) {
    pkgInfoCopy.latest.author.avatar = (0, _user.generateGravatarUrl)(author.email);
  }

  if (author && _lodash2.default.isString(author)) {
    pkgInfoCopy.latest.author = {
      avatar: (0, _user.generateGravatarUrl)(),
      email: '',
      author
    };
  }

  // for contributors
  if (_lodash2.default.isEmpty(contributors) === false) {
    pkgInfoCopy.latest.contributors = contributors.map(contributor => {
      contributor.avatar = (0, _user.generateGravatarUrl)(contributor.email);
      return contributor;
    });
  }

  // for maintainers
  if (_lodash2.default.isEmpty(maintainers) === false) {
    pkgInfoCopy.latest.maintainers = maintainers.map(maintainer => {
      maintainer.avatar = (0, _user.generateGravatarUrl)(maintainer.email);
      return maintainer;
    });
  }

  return pkgInfoCopy;
}

/**
 * parse package readme - markdown/ascii
 * @param {String} packageName name of package
 * @param {String} readme package readme
 * @return {String} converted html template
 */
function parseReadme(packageName, readme) {
  const asciiRegex = /^\n?(?:={1,5}[ \t]+\S|[^#].*(\n(?!#+[ \t]+\S).*){0,8}\n={1,5}[ \t]+\S)/;
  const docTypeIdentifier = new RegExp(asciiRegex, 'g');
  // asciidoc
  if (docTypeIdentifier.test(readme)) {
    const ascii = (0, _asciidoctor2.default)();
    return ascii.convert(readme, {
      safe: 'safe',
      attributes: { showtitle: true, icons: 'font' }
    });
  }

  if (readme) {
    return (0, _marked2.default)(readme);
  }

  // logs readme not found error
  Logger.logger.error({ packageName }, '@{packageName}: No readme found');

  return (0, _marked2.default)('ERROR: No README data found!');
}

function buildToken(type, token) {
  return `${_lodash2.default.capitalize(type)} ${token}`;
}

exports.addGravatarSupport = addGravatarSupport;
exports.deleteProperties = deleteProperties;
exports.addScope = addScope;
exports.sortByName = sortByName;
exports.folder_exists = folder_exists;
exports.fileExists = fileExists;
exports.parseInterval = parseInterval;
exports.semverSort = semverSort;
exports.parse_address = parse_address;
exports.getVersion = getVersion;
exports.tagVersion = tagVersion;
exports.combineBaseUrl = combineBaseUrl;
exports.validate_metadata = validate_metadata;
exports.isObject = isObject;
exports.validateName = validateName;
exports.validate_package = validate_package;
exports.getWebProtocol = getWebProtocol;
exports.getLatestVersion = getLatestVersion;
exports.ErrorCode = ErrorCode;
exports.parseConfigFile = parseConfigFile;
exports.parseReadme = parseReadme;