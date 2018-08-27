'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeVersions = mergeVersions;

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Function gets a local info and an info from uplinks and tries to merge it
 exported for unit tests only.
  * @param {*} local
  * @param {*} up
  * @param {*} config
  * @static
  */
function mergeVersions(local, up) {
  // copy new versions to a cache
  // NOTE: if a certain version was updated, we can't refresh it reliably
  for (let i in up.versions) {
    if (_lodash2.default.isNil(local.versions[i])) {
      local.versions[i] = up.versions[i];
    }
  }

  for (let i in up[_utils.DIST_TAGS]) {
    if (local[_utils.DIST_TAGS][i] !== up[_utils.DIST_TAGS][i]) {
      if (!local[_utils.DIST_TAGS][i] || _semver2.default.lte(local[_utils.DIST_TAGS][i], up[_utils.DIST_TAGS][i])) {
        local[_utils.DIST_TAGS][i] = up[_utils.DIST_TAGS][i];
      }
      if (i === 'latest' && local[_utils.DIST_TAGS][i] === up[_utils.DIST_TAGS][i]) {
        // if remote has more fresh package, we should borrow its readme
        local.readme = up.readme;
      }
    }
  }
}