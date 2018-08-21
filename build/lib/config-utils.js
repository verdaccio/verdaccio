'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.normalizeUserlist = normalizeUserlist;
exports.uplinkSanityCheck = uplinkSanityCheck;
exports.sanityCheckNames = sanityCheckNames;
exports.sanityCheckUplinksProps = sanityCheckUplinksProps;
exports.hasProxyTo = hasProxyTo;
exports.getMatchedPackagesSpec = getMatchedPackagesSpec;
exports.normalisePackageAccess = normalisePackageAccess;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BLACKLIST = {
  all: true,
  anonymous: true,
  undefined: true,
  owner: true,
  none: true
};

/**
 * Normalise user list.
 * @return {Array}
 */
function normalizeUserlist(oldFormat, newFormat) {
  const result = [];
  /* eslint prefer-rest-params: "off" */

  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i] == null) {
      continue;
    }

    // if it's a string, split it to array
    if (_lodash2.default.isString(arguments[i])) {
      result.push(arguments[i].split(/\s+/));
    } else if (Array.isArray(arguments[i])) {
      result.push(arguments[i]);
    } else {
      throw _utils.ErrorCode.getInternalError('CONFIG: bad package acl (array or string expected): ' + JSON.stringify(arguments[i]));
    }
  }
  return _lodash2.default.flatten(result);
}

function uplinkSanityCheck(uplinks, users = BLACKLIST) {
  const newUplinks = _lodash2.default.clone(uplinks);
  let newUsers = _lodash2.default.clone(users);

  for (let uplink in newUplinks) {
    if (Object.prototype.hasOwnProperty.call(newUplinks, uplink)) {
      if (_lodash2.default.isNil(newUplinks[uplink].cache)) {
        newUplinks[uplink].cache = true;
      }
      newUsers = sanityCheckNames(uplink, newUsers);
    }
  }

  return newUplinks;
}

function sanityCheckNames(item, users) {
  (0, _assert2.default)(item !== 'all' && item !== 'owner' && item !== 'anonymous' && item !== 'undefined' && item !== 'none', 'CONFIG: reserved uplink name: ' + item);
  (0, _assert2.default)(!item.match(/\s/), 'CONFIG: invalid uplink name: ' + item);
  (0, _assert2.default)(_lodash2.default.isNil(users[item]), 'CONFIG: duplicate uplink name: ' + item);
  users[item] = true;

  return users;
}

function sanityCheckUplinksProps(configUpLinks) {
  const uplinks = _lodash2.default.clone(configUpLinks);

  for (let uplink in uplinks) {
    if (Object.prototype.hasOwnProperty.call(uplinks, uplink)) {
      (0, _assert2.default)(uplinks[uplink].url, 'CONFIG: no url for uplink: ' + uplink);
      (0, _assert2.default)(_lodash2.default.isString(uplinks[uplink].url), 'CONFIG: wrong url format for uplink: ' + uplink);
      uplinks[uplink].url = uplinks[uplink].url.replace(/\/$/, '');
    }
  }

  return uplinks;
}

/**
 * Check whether an uplink can proxy
 */
function hasProxyTo(pkg, upLink, packages) {
  const matchedPkg = getMatchedPackagesSpec(pkg, packages);
  const proxyList = typeof matchedPkg !== 'undefined' ? matchedPkg.proxy : [];
  if (proxyList) {
    return proxyList.some(curr => upLink === curr);
  }

  return false;
}

function getMatchedPackagesSpec(pkgName, packages) {
  for (let i in packages) {
    // $FlowFixMe
    if (_minimatch2.default.makeRe(i).exec(pkgName)) {
      return packages[i];
    }
  }
  return;
}

function normalisePackageAccess(packages) {
  const normalizedPkgs = _extends({}, packages);
  // add a default rule for all packages to make writing plugins easier
  if (_lodash2.default.isNil(normalizedPkgs['**'])) {
    normalizedPkgs['**'] = {};
  }

  for (let pkg in packages) {
    if (Object.prototype.hasOwnProperty.call(packages, pkg)) {
      (0, _assert2.default)(_lodash2.default.isObject(packages[pkg]) && _lodash2.default.isArray(packages[pkg]) === false, `CONFIG: bad "'${pkg}'" package description (object expected)`);
      normalizedPkgs[pkg].access = normalizeUserlist(packages[pkg].allow_access, packages[pkg].access);
      delete normalizedPkgs[pkg].allow_access;
      normalizedPkgs[pkg].publish = normalizeUserlist(packages[pkg].allow_publish, packages[pkg].publish);
      delete normalizedPkgs[pkg].allow_publish;
      normalizedPkgs[pkg].proxy = normalizeUserlist(packages[pkg].proxy_access, packages[pkg].proxy);
      delete normalizedPkgs[pkg].proxy_access;
    }
  }

  return normalizedPkgs;
}