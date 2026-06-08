import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { API_ERROR, errorUtils, ipUtils } from '@verdaccio/core';
import type { Logger, Token } from '@verdaccio/types';

import type { $RequestExtend } from '../types';

const WRITE_METHODS = new Set(['DELETE', 'PATCH', 'POST', 'PUT']);

/**
 * Minimal storage surface required to enforce generated token metadata. Typed
 * structurally so this package does not need to depend on `@verdaccio/store`.
 */
export interface TokenReadableStorage {
  /**
   * Load the generated tokens stored for a user.
   *
   * @param filter narrows the lookup to a single `user`
   * @returns the user's persisted tokens
   */
  readTokens(filter: { user: string }): Promise<Token[]>;
}

/**
 * Resolve the client address of an incoming request for CIDR matching.
 *
 * Prefers the `x-forwarded-for` header (taking the first, client-most entry of
 * the comma-separated list) and falls back to `req.ip` and then the raw socket
 * address. The result is normalized (trimmed and IPv4-mapped IPv6 prefixes
 * stripped) via {@link ipUtils.normalizeAddress}.
 *
 * @param req the incoming Express request
 * @returns the normalized client address, or `undefined` when none can be determined
 */
function getClientAddress(req: Request): string | undefined {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (Array.isArray(forwardedFor)) {
    return ipUtils.normalizeAddress(forwardedFor[0]?.split(',')[0]);
  }

  if (typeof forwardedFor === 'string') {
    return ipUtils.normalizeAddress(forwardedFor.split(',')[0]);
  }

  return ipUtils.normalizeAddress(req.ip || req.socket.remoteAddress);
}

/**
 * Find the stored token whose `key` matches the key carried by the request.
 *
 * @param tokens the tokens persisted for the authenticated user
 * @param tokenKey the key extracted from the presented generated token
 * @returns the matching {@link Token}, or `undefined` when it has been revoked / never existed
 */
function findToken(tokens: Token[], tokenKey: string): Token | undefined {
  return tokens.find(({ key }) => key === tokenKey);
}

/**
 * Express middleware that enforces the metadata of npm-style generated tokens
 * (created via `POST /-/npm/v1/tokens`).
 *
 * A generated token embeds a server-issued `key` that is recovered from the
 * verified credentials as `remote_user.token.key`. This middleware looks that
 * key up in storage and rejects the request when the token:
 * - is missing from storage (revoked or never issued);
 * - is used from a client address outside its `cidr` whitelist;
 * - is `readonly` and the request uses a write method (`DELETE`/`PATCH`/`POST`/`PUT`).
 *
 * Requests that do not carry a generated token key (e.g. interactive logins)
 * pass through untouched. It must run after the JWT/auth middleware has
 * populated `remote_user`. Failures fail closed: a storage lookup error yields
 * an internal error rather than allowing the request.
 *
 * @param storage storage exposing {@link TokenReadableStorage.readTokens} to load the user's tokens
 * @param logger logger used to record rejected attempts and lookup failures
 * @returns an Express {@link RequestHandler} that calls `next()` to allow or `next(error)` to reject
 */
export function enforceGeneratedTokenMetadata(
  storage: TokenReadableStorage,
  logger: Logger
): RequestHandler {
  return async function (req: Request, _res: Response, next: NextFunction): Promise<void> {
    const remoteUser = (req as $RequestExtend).remote_user;
    const tokenKey = remoteUser?.token?.key;

    if (!tokenKey) {
      return next();
    }

    const user = remoteUser?.name;

    if (typeof user !== 'string') {
      return next(errorUtils.getForbidden(API_ERROR.UNAUTHORIZED_ACCESS));
    }

    try {
      const token = findToken(await storage.readTokens({ user }), tokenKey);

      if (!token) {
        logger.warn({ tokenKey, user }, 'generated token @{tokenKey} for user @{user} is missing');
        return next(errorUtils.getForbidden(API_ERROR.UNAUTHORIZED_ACCESS));
      }

      if (!ipUtils.isAddressAllowed(getClientAddress(req), token.cidr)) {
        logger.warn(
          { tokenKey, user },
          'generated token @{tokenKey} for user @{user} was used outside its CIDR whitelist'
        );
        return next(errorUtils.getForbidden(API_ERROR.UNAUTHORIZED_ACCESS));
      }

      if (token.readonly && WRITE_METHODS.has(req.method)) {
        logger.warn(
          { tokenKey, user },
          'readonly generated token @{tokenKey} for user @{user} was used for a write request'
        );
        return next(errorUtils.getForbidden(API_ERROR.UNAUTHORIZED_ACCESS));
      }

      return next();
    } catch (error: any) {
      logger.error({ error: error.msg }, 'generated token metadata lookup failed: @{error}');
      return next(errorUtils.getInternalError(error.message));
    }
  };
}
