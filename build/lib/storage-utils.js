'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pkgFileName = exports.noSuchFile = exports.fileExist = exports.cleanUpReadme = exports.getLatestReadme = exports.generateRevision = exports.normalizePackage = exports.generatePackageTemplate = exports.WHITELIST = exports.DEFAULT_REVISION = undefined;
exports.cleanUpLinksRef = cleanUpLinksRef;
exports.checkPackageLocal = checkPackageLocal;
exports.publishPackage = publishPackage;
exports.checkPackageRemote = checkPackageRemote;
exports.mergeUplinkTimeIntoLocal = mergeUplinkTimeIntoLocal;
exports.prepareSearchPackage = prepareSearchPackage;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var _search = require('./search');

var _search2 = _interopRequireDefault(_search);

var _cryptoUtils = require('../lib/crypto-utils');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pkgFileName = 'package.json';

const fileExist = 'EEXISTS';
const noSuchFile = 'ENOENT';
const DEFAULT_REVISION = exports.DEFAULT_REVISION = `0-0000000000000000`;

const generatePackageTemplate = function (name) {
  return {
    // standard things
    name,
    versions: {},
    time: {},
    [_utils.DIST_TAGS]: {},
    _uplinks: {},
    _distfiles: {},
    _attachments: {},
    _rev: ''
  };
};

/**
 * Normalise package properties, tags, revision id.
 * @param {Object} pkg package reference.
 */
function normalizePackage(pkg) {
  const pkgProperties = ['versions', 'dist-tags', '_distfiles', '_attachments', '_uplinks', 'time'];

  pkgProperties.forEach(key => {
    const pkgProp = pkg[key];

    if (_lodash2.default.isNil(pkgProp) || (0, _utils.isObject)(pkgProp) === false) {
      pkg[key] = {};
    }
  });

  if (_lodash2.default.isString(pkg._rev) === false) {
    pkg._rev = DEFAULT_REVISION;
  }

  // normalize dist-tags
  (0, _utils.normalizeDistTags)(pkg);

  return pkg;
}

function generateRevision(rev) {
  const _rev = rev.split('-');

  return (+_rev[0] || 0) + 1 + '-' + (0, _cryptoUtils.generateRandomHexString)();
}

function getLatestReadme(pkg) {
  const versions = pkg['versions'] || {};
  const distTags = pkg['dist-tags'] || {};
  const latestVersion = distTags['latest'] ? versions[distTags['latest']] || {} : {};
  let readme = _lodash2.default.trim(pkg.readme || latestVersion.readme || '');
  if (readme) {
    return readme;
  }
  // In case of empty readme - trying to get ANY readme in the following order: 'next','beta','alpha','test','dev','canary'
  const readmeDistTagsPriority = ['next', 'beta', 'alpha', 'test', 'dev', 'canary'];
  readmeDistTagsPriority.map(function (tag) {
    if (readme) {
      return readme;
    }
    const data = distTags[tag] ? versions[distTags[tag]] || {} : {};
    readme = _lodash2.default.trim(data.readme || readme);
  });
  return readme;
}

function cleanUpReadme(version) {
  if (_lodash2.default.isNil(version) === false) {
    delete version.readme;
  }

  return version;
}

const WHITELIST = exports.WHITELIST = ['_rev', 'name', 'versions', _utils.DIST_TAGS, 'readme', 'time'];

function cleanUpLinksRef(keepUpLinkData, result) {
  const propertyToKeep = [...WHITELIST];
  if (keepUpLinkData === true) {
    propertyToKeep.push('_uplinks');
  }

  for (let i in result) {
    if (propertyToKeep.indexOf(i) === -1) {
      // Remove sections like '_uplinks' from response
      delete result[i];
    }
  }

  return result;
}

/**
 * Check whether a package it is already a local package
 * @param {*} name
 * @param {*} localStorage
 */
function checkPackageLocal(name, localStorage) {
  return new Promise((resolve, reject) => {
    localStorage.getPackageMetadata(name, (err, results) => {
      if (!_lodash2.default.isNil(err) && err.status !== _constants.HTTP_STATUS.NOT_FOUND) {
        return reject(err);
      }
      if (results) {
        return reject(_utils.ErrorCode.getConflict(_constants.API_ERROR.PACKAGE_EXIST));
      }
      return resolve();
    });
  });
}

function publishPackage(name, metadata, localStorage) {
  return new Promise((resolve, reject) => {
    localStorage.addPackage(name, metadata, (err, latest) => {
      if (!_lodash2.default.isNull(err)) {
        return reject(err);
      } else if (!_lodash2.default.isUndefined(latest)) {
        _search2.default.add(latest);
      }
      return resolve();
    });
  });
}

function checkPackageRemote(name, isAllowPublishOffline, syncMetadata) {
  return new Promise((resolve, reject) => {
    // $FlowFixMe
    syncMetadata(name, null, {}, (err, packageJsonLocal, upLinksErrors) => {
      // something weird
      if (err && err.status !== _constants.HTTP_STATUS.NOT_FOUND) {
        return reject(err);
      }

      // checking package exist already
      if (_lodash2.default.isNil(packageJsonLocal) === false) {
        return reject(_utils.ErrorCode.getConflict(_constants.API_ERROR.PACKAGE_EXIST));
      }

      for (let errorItem = 0; errorItem < upLinksErrors.length; errorItem++) {
        // checking error
        // if uplink fails with a status other than 404, we report failure
        if (_lodash2.default.isNil(upLinksErrors[errorItem][0]) === false) {
          if (upLinksErrors[errorItem][0].status !== _constants.HTTP_STATUS.NOT_FOUND) {
            if (isAllowPublishOffline) {
              return resolve();
            }

            return reject(_utils.ErrorCode.getServiceUnavailable(_constants.API_ERROR.UPLINK_OFFLINE_PUBLISH));
          }
        }
      }

      return resolve();
    });
  });
}

function mergeUplinkTimeIntoLocal(localMetadata, remoteMetadata) {
  if ('time' in remoteMetadata) {
    return Object.assign({}, localMetadata.time, remoteMetadata.time);
  }

  return localMetadata.time;
}

function prepareSearchPackage(data, time) {
  const listVersions = Object.keys(data.versions);
  const versions = (0, _utils.semverSort)(listVersions);
  const latest = data[_utils.DIST_TAGS] && data[_utils.DIST_TAGS].latest ? data[_utils.DIST_TAGS].latest : versions.pop();

  if (data.versions[latest]) {
    const version = data.versions[latest];
    const pkg = {
      name: version.name,
      description: version.description,
      [_utils.DIST_TAGS]: { latest },
      maintainers: version.maintainers || [version.author].filter(Boolean),
      author: version.author,
      repository: version.repository,
      readmeFilename: version.readmeFilename || '',
      homepage: version.homepage,
      keywords: version.keywords,
      bugs: version.bugs,
      license: version.license,
      time: {
        modified: time
      },
      versions: { [latest]: 'latest' }
    };

    return pkg;
  }
}

exports.generatePackageTemplate = generatePackageTemplate;
exports.normalizePackage = normalizePackage;
exports.generateRevision = generateRevision;
exports.getLatestReadme = getLatestReadme;
exports.cleanUpReadme = cleanUpReadme;
exports.fileExist = fileExist;
exports.noSuchFile = noSuchFile;
exports.pkgFileName = pkgFileName;