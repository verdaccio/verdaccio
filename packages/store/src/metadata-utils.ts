import semver from 'semver';
import _ from 'lodash';
import { DIST_TAGS } from '@verdaccio/commons-api';

import { Package } from '@verdaccio/types';

/**
 * Function gets a local info and an info from uplinks and tries to merge it
 exported for unit tests only.
  * @param {*} local
  * @param {*} up
  * @param {*} config
  * @static
  */
export function mergeVersions(local: Package, up: Package) {
  // copy new versions to a cache
  // NOTE: if a certain version was updated, we can't refresh it reliably
  for (const i in up.versions) {
    if (_.isNil(local.versions[i])) {
      local.versions[i] = up.versions[i];
    }
  }

  for (const i in up[DIST_TAGS]) {
    if (local[DIST_TAGS][i] !== up[DIST_TAGS][i]) {
      if (!local[DIST_TAGS][i] || semver.lte(local[DIST_TAGS][i], up[DIST_TAGS][i])) {
        local[DIST_TAGS][i] = up[DIST_TAGS][i];
      }
      if (i === 'latest' && local[DIST_TAGS][i] === up[DIST_TAGS][i]) {
        // if remote has more fresh package, we should borrow its readme
        local.readme = up.readme;
      }
    }
  }
}
