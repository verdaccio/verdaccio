import buildDebug from 'debug';
import { URL } from 'node:url';

import { errorUtils } from '@verdaccio/core';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:make-url-relative');

/**
 * Removes the host from the URL and turns it into a relative URL.
 * @param req
 * @param res
 * @param next
 */
export function makeURLrelative(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  const original = req.url;

  // npm requests can contain the full URL, including the hostname, for example:
  // tarball downloads. Removing the hostname makes the URL relative and allows
  // the application to handle requests in a more consistent way.

  let url;
  try {
    // In productive use, the URL is absolute (and base will be ignored)
    // In tests, the URL might brelative (and base will be used)
    // https://nodejs.org/docs/latest/api/url.html#new-urlinput-base
    url = new URL(req.url, `${req.protocol}://${req.headers.host}/`);
  } catch (error) {
    return next(errorUtils.getBadRequest(`Invalid URL: ${req.url} (${error})`));
  }

  // Rebuild the URL without hostname
  req.url = url.pathname + url.search + url.hash;

  if (original !== req.url) {
    debug('makeURLrelative: %o -> %o', original, req.url);
  } else {
    debug('makeURLrelative: %o (unchanged)', original);
  }
  next();
}
