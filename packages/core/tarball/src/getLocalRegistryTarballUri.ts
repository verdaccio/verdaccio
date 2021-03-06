import URL from 'url';
import { Request } from 'express';
import buildDebug from 'debug';

import { encodeScopedUri } from '@verdaccio/utils';
import { getPublicUrl } from '@verdaccio/url';

const debug = buildDebug('verdaccio:core:url');

function extractTarballFromUrl(url: string): string {
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
  req: Request,
  urlPrefix: string | void
): string {
  const currentHost = req.headers.host;

  if (!currentHost) {
    return uri;
  }
  const tarballName = extractTarballFromUrl(uri);
  debug('tarball name %o', tarballName);
  // header only set with proxy that setup with HTTPS
  const domainRegistry = getPublicUrl(urlPrefix || '', req);

  return `${domainRegistry}${encodeScopedUri(pkgName)}/-/${tarballName}`;
}
