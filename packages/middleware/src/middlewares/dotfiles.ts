import { HTTP_STATUS, errorUtils } from '@verdaccio/core';

import type { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';

export type DotfilesPolicy = 'allow' | 'deny' | 'ignore';

/**
 * Middleware that controls how requests with dotfile path segments
 * (e.g. /.env, /.well-known/, /.git/) are handled.
 *
 * Mirrors the semantics of serve-static's `dotfiles` option:
 * - 'deny': respond with 403
 * - 'ignore': respond with 404 (default)
 * - 'allow': pass through to next middleware
 */
export function dotfiles(policy: DotfilesPolicy = 'ignore') {
  return function dotfilesMiddleware(
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer
  ): void {
    if (
      policy !== 'allow' &&
      req.path.split('/').some((segment) => segment.startsWith('.') && segment.length > 1)
    ) {
      if (policy === 'deny') {
        res.statusCode = HTTP_STATUS.FORBIDDEN;
        res.end();
      } else {
        next(errorUtils.getNotFound('resource not found'));
      }
      return;
    }
    next();
  };
}
