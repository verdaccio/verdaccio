import buildDebug from 'debug';

import { errorUtils } from '@verdaccio/core';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

const debug = buildDebug('verdaccio:middleware:encode');

/**
 * Encode / in a scoped package name to be matched as a single parameter in routes
 * @param req
 * @param res
 * @param next
 */
export function encodeScopePackage(
  req: $RequestExtend,
  res: $ResponseExtend,
  next: $NextFunctionVer
): void {
  const original = req.url;

  // Expect relative URLs i.e. should call makeURLrelative before this middleware
  if (!req.url.startsWith('/')) {
    return next(errorUtils.getBadRequest(`Invalid URL: ${req.url} (must be relative)`));
  }

  // If the @ sign is encoded, we need to decode it first
  // e.g.: /%40org/pkg/1.2.3 -> /@org/pkg/1.2.3
  // For scoped packages, encode the slash to make it a single path segment/parameter
  // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
  req.url = req.url.replace(/^\/%40/, '/@').replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F');

  if (original !== req.url) {
    debug('encodeScopePackage: %o -> %o', original, req.url);
  } else {
    debug('encodeScopePackage: %o (unchanged)', original);
  }
  next();
}
