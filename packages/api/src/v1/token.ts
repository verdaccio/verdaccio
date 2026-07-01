import type { Response, Router } from 'express';
import { isBoolean, isNil } from 'lodash-es';

import type { Auth } from '@verdaccio/auth';
import { getApiToken } from '@verdaccio/auth';
import {
  HEADERS,
  HTTP_STATUS,
  SUPPORT_ERRORS,
  cryptoUtils,
  errorUtils,
  reqUtils,
} from '@verdaccio/core';
import { TOKEN_API_ENDPOINTS, rateLimit } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Config, Logger, RemoteUser, Token } from '@verdaccio/types';

import type { $NextFunctionVer, $RequestExtend } from '../../types/custom';

// Granular access token options (npm >= 11) that Verdaccio does not implement
// yet. They are accepted so `npm token create` succeeds, but the restrictions
// they express are NOT enforced — warn so the operator is not misled.
const UNSUPPORTED_TOKEN_OPTIONS = [
  'packages_and_scopes_permission',
  'packages',
  'packages_all',
  'scopes',
  'orgs',
  'orgs_permission',
  'expires',
  'description',
  'bypass_2fa',
];

export type NormalizeToken = Token & {
  cidr_whitelist: string[];
  created: string;
};

// npm expects "cidr_whitelist" for token list
function normalizeToken(token: Token): NormalizeToken {
  return {
    ...token,
    cidr_whitelist: token.cidr || [],
    created: new Date(token.created).toISOString(),
  };
}

// https://github.com/npm/npm-profile/blob/latest/lib/index.js
export default function (
  route: Router,
  auth: Auth,
  storage: Storage,
  config: Config,
  logger: Logger
): void {
  route.get(
    TOKEN_API_ENDPOINTS.get_tokens,
    rateLimit(config?.userRateLimit),
    async function (req: $RequestExtend, res: Response, next: $NextFunctionVer) {
      const { name } = req.remote_user;

      if (isNil(name) === false) {
        try {
          const tokens = await storage.readTokens({ user: name });
          const totalTokens = tokens.length;
          logger.debug({ totalTokens }, 'token list retrieved: @{totalTokens}');

          res.status(HTTP_STATUS.OK);
          return next({
            objects: tokens.map(normalizeToken),
            urls: {
              next: '', // TODO: pagination?
            },
          });
        } catch (error: any) {
          logger.error({ error: error.msg }, 'token list has failed: @{error}');
          return next(errorUtils.getCode(HTTP_STATUS.INTERNAL_ERROR, error.message));
        }
      }
      return next(errorUtils.getUnauthorized());
    }
  );

  route.post(
    TOKEN_API_ENDPOINTS.get_tokens,
    rateLimit(config?.userRateLimit),
    function (req: $RequestExtend, res: Response, next: $NextFunctionVer) {
      const { password } = req.body;
      const { name } = req.remote_user;
      // `readonly` and `cidr_whitelist` are optional: npm >= 11 rewrote
      // `npm token create` to omit them (and only sends `cidr_whitelist` with
      // `--cidr`), so default them rather than rejecting the request. A wrong
      // type is still rejected.
      const readonly = req.body.readonly ?? false;
      const cidr_whitelist = req.body.cidr_whitelist ?? [];

      if (!isBoolean(readonly) || !Array.isArray(cidr_whitelist)) {
        return next(errorUtils.getCode(HTTP_STATUS.BAD_DATA, SUPPORT_ERRORS.PARAMETERS_NOT_VALID));
      }

      const unsupportedOptions = UNSUPPORTED_TOKEN_OPTIONS.filter(
        (option) => isNil(req.body[option]) === false
      );
      if (unsupportedOptions.length > 0) {
        logger.warn(
          { options: unsupportedOptions.join(', '), userAgent: req.get('user-agent') ?? 'unknown' },
          'granular access token options are not supported yet and will be ignored: @{options} (client: @{userAgent})'
        );
      }

      auth.authenticate(name, password, async (err, user?: RemoteUser) => {
        if (err) {
          const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
          return next(errorUtils.getCode(errorCode, err.message));
        }

        req.remote_user = user;

        if (typeof storage.saveToken !== 'function') {
          return next(
            errorUtils.getCode(HTTP_STATUS.NOT_IMPLEMENTED, SUPPORT_ERRORS.STORAGE_NOT_IMPLEMENT)
          );
        }

        try {
          const key = cryptoUtils.generateRandomHexString(16);
          const token = await getApiToken(auth, config, user as RemoteUser, password, {
            tokenKey: key,
          });
          if (!token) {
            throw errorUtils.getInternalError();
          }

          // TODO: use a utility here
          const maskedToken = cryptoUtils.mask(token, 5);
          const created = new Date().getTime();

          /**
           * cidr_whitelist: is not being used, we pass it through
           * token: we do not store the real token (it is generated once and retrieved
           * to the user), just a mask of it.
           */
          const saveToken: Token = {
            user: name,
            token: maskedToken,
            key,
            cidr: cidr_whitelist,
            readonly,
            created,
          };

          await storage.saveToken(saveToken);
          logger.debug({ key, name }, 'token @{key} was created for user @{name}');
          res.set(HEADERS.CACHE_CONTROL, HEADERS.NO_CACHE);
          return next(
            normalizeToken({
              token,
              user: name,
              key: saveToken.key,
              cidr: cidr_whitelist,
              readonly,
              created: saveToken.created,
            })
          );
        } catch (error: any) {
          logger.error({ error: error.msg }, 'token creation has failed: @{error}');
          return next(errorUtils.getInternalError(error.message));
        }
      });
    }
  );

  route.delete(
    TOKEN_API_ENDPOINTS.delete_token,
    rateLimit(config?.userRateLimit),
    async (req: $RequestExtend, res: Response, next: $NextFunctionVer) => {
      const tokenKey = reqUtils.paramToString(req.params.tokenKey);
      const { name } = req.remote_user;

      if (isNil(name) === false) {
        logger.debug({ name }, '@{name} has requested remove a token');
        try {
          await storage.deleteToken(name, tokenKey);
          logger.info({ tokenKey, name }, 'token id @{tokenKey} was revoked for user @{name}');
          return next({});
        } catch (error: any) {
          logger.error({ error: error.msg }, 'token creation has failed: @{error}');
          return next(errorUtils.getCode(HTTP_STATUS.INTERNAL_ERROR, error.message));
        }
      }
      return next(errorUtils.getUnauthorized());
    }
  );
}
