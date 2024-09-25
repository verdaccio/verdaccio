import buildDebug from 'debug';

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
  // If the @ sign is encoded, we need to decode it first
  // e.g.: /%40org/pkg/1.2.3 -> /@org/pkg/1.2.3
  if (req.url.indexOf('%40') !== -1) {
    req.url = req.url.replace(/^\/%40/, '/@');
  }
  if (req.url.indexOf('@') !== -1) {
    // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
    req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F');
  }
  debug('encodeScopePackage: %o -> %o', original, req.url);
  next();
}
