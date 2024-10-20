import { Response, Router } from 'express';
import _ from 'lodash';

import { getApiToken } from '@verdaccio/auth';
import { Auth } from '@verdaccio/auth';
import { HEADERS, HTTP_STATUS, SUPPORT_ERRORS, errorUtils } from '@verdaccio/core';
import { rateLimit } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Config, RemoteUser, Token } from '@verdaccio/types';
import { Logger } from '@verdaccio/types';
import { mask, stringToMD5 } from '@verdaccio/utils';

import { $NextFunctionVer, $RequestExtend } from '../../types/custom';

export type NormalizeToken = Token & {
  created: string;
};

function normalizeToken(token: Token): NormalizeToken {
  return {
    ...token,
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
    '/-/npm/v1/tokens',
    rateLimit(config?.userRateLimit),
    async function (req: $RequestExtend, res: Response, next: $NextFunctionVer) {
      const { name } = req.remote_user;

      if (_.isNil(name) === false) {
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
    '/-/npm/v1/tokens',
    rateLimit(config?.userRateLimit),
    function (req: $RequestExtend, res: Response, next: $NextFunctionVer) {
      const { password, readonly, cidr_whitelist } = req.body;
      const { name } = req.remote_user;

      if (!_.isBoolean(readonly) || !_.isArray(cidr_whitelist)) {
        return next(errorUtils.getCode(HTTP_STATUS.BAD_DATA, SUPPORT_ERRORS.PARAMETERS_NOT_VALID));
      }

      auth.authenticate(name, password, async (err, user?: RemoteUser) => {
        if (err) {
          const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
          return next(errorUtils.getCode(errorCode, err.message));
        }

        req.remote_user = user;

        if (!_.isFunction(storage.saveToken)) {
          return next(
            errorUtils.getCode(HTTP_STATUS.NOT_IMPLEMENTED, SUPPORT_ERRORS.STORAGE_NOT_IMPLEMENT)
          );
        }

        try {
          const token = await getApiToken(auth, config, user as RemoteUser, password);
          if (!token) {
            throw errorUtils.getInternalError();
          }

          const key = stringToMD5(token);
          // TODO: use a utility here
          const maskedToken = mask(token, 5);
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
          res.set(HEADERS.CACHE_CONTROL, 'no-cache, no-store');
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
    '/-/npm/v1/tokens/token/:tokenKey',
    rateLimit(config?.userRateLimit),
    async (req: $RequestExtend, res: Response, next: $NextFunctionVer) => {
      const {
        params: { tokenKey },
      } = req;
      const { name } = req.remote_user;

      if (_.isNil(name) === false) {
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
