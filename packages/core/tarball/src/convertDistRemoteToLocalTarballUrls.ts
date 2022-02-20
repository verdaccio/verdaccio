import _ from 'lodash';

import { Package, Version } from '@verdaccio/types';
import { RequestOptions } from '@verdaccio/url';

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
  const { name, versions } = pkg;
  const convertedPkg = { ...pkg };
  const convertedVersions = versions;
  for (const ver in pkg.versions) {
    if (Object.prototype.hasOwnProperty.call(pkg.versions, ver)) {
      const version = versions[ver];
      convertedVersions[ver] = convertDistVersionToLocalTarballsUrl(
        name,
        version,
        request,
        urlPrefix
      );
    }
  }

  return {
    ...convertedPkg,
    versions: convertedVersions,
  };
}

/**
 * Convert single Version disst tarball
 * @param name
 * @param version
 * @param request
 * @param urlPrefix
 * @returns
 */
export function convertDistVersionToLocalTarballsUrl(name, version: Version, request, urlPrefix) {
  const distName = version.dist;

  if (_.isNull(distName) === false && _.isNull(distName.tarball) === false) {
    return {
      ...version,
      dist: {
        ...distName,
        tarball: getLocalRegistryTarballUri(distName.tarball, name, request, urlPrefix),
      },
    };
  }

  return version;
}
