import buildDebug from 'debug';

import { tarballUtils } from '@verdaccio/core';
import { RequestOptions, getPublicUrl } from '@verdaccio/url';

const debug = buildDebug('verdaccio:core:tarball');

/**
 * Filter a tarball url.
 * @param {*} uri
 * @return {String} a parsed url
 */
export function getLocalRegistryTarballUri(
  uri: string,
  pkgName: string,
  requestOptions: RequestOptions,
  urlPrefix: string | void
): string {
  const currentHost = requestOptions?.headers?.host;

  if (!currentHost) {
    return uri;
  }
  const tarballName = tarballUtils.extractTarballFromUrl(uri);
  debug('tarball name %o', tarballName);
  // header only set with proxy that setup with HTTPS
  const domainRegistry = getPublicUrl(urlPrefix || '', requestOptions);

  return `${domainRegistry}${pkgName}/-/${tarballName}`;
}
