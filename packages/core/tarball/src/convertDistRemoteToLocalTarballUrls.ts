import { Package } from '@verdaccio/types';
import { RequestOptions } from '@verdaccio/url';
import _ from 'lodash';

import { getLocalRegistryTarballUri } from './getLocalRegistryTarballUri';

/**
 * Iterate a packages's versions and filter each original tarball url.
 * @param {*} pkg
 * @param {*} req
 * @param {*} config
 * @return {String} a filtered package
 */
export function convertDistRemoteToLocalTarballUrls(
  pkg: Package,
  request: RequestOptions,
  urlPrefix: string | void
): Package {
  for (const ver in pkg.versions) {
    if (Object.prototype.hasOwnProperty.call(pkg.versions, ver)) {
      const distName = pkg.versions[ver].dist;

      if (_.isNull(distName) === false && _.isNull(distName.tarball) === false) {
        distName.tarball = getLocalRegistryTarballUri(
          distName.tarball,
          pkg.name,
          request,
          urlPrefix
        );
      }
    }
  }
  return pkg;
}
