import buildDebug from 'debug';
import URL from 'url';

import { RequestOptions } from '@verdaccio/url';
import { getPublicUrl } from '@verdaccio/url';

const debug = buildDebug('verdaccio:core:url');

export function extractTarballFromUrl(url: string): string {
  // @ts-ignore
  return URL.parse(url).pathname.replace(/^.*\//, '');
}
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
  const tarballName = extractTarballFromUrl(uri);
  debug('tarball name %o', tarballName);
  // header only set with proxy that setup with HTTPS
  const domainRegistry = getPublicUrl(urlPrefix || '', requestOptions);

  return `${domainRegistry}${pkgName}/-/${tarballName}`;
}
