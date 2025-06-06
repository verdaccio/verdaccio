import { Manifest, Version } from '@verdaccio/types';
import { RequestOptions } from '@verdaccio/url';

import { getLocalRegistryTarballUri } from './getLocalRegistryTarballUri';

/**
 * Iterate a packages's versions and filter each original tarball url.
 * @param {*} pkg
 * @param {*} request
 * @param {*} urlPrefix
 * @return {String} a filtered package
 */
export function convertDistRemoteToLocalTarballUrls(
  pkg: Manifest,
  request: RequestOptions,
  urlPrefix: string | void
): Manifest {
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
export function convertDistVersionToLocalTarballsUrl(
  name: string,
  version: Version,
  request: RequestOptions,
  urlPrefix: string | void
) {
  const distName = version.dist;

  if (distName && distName.tarball) {
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
