import buildDebug from 'debug';
import { Response, Router } from 'express';
import _ from 'lodash';

import { rateLimit } from '@verdaccio/middleware';
import { Config, RemoteUser, Token } from '@verdaccio/types';
import { stringToMD5 } from '@verdaccio/utils';

import { getApiToken } from '../../../../lib/auth-utils';
import { HEADERS, HTTP_STATUS, SUPPORT_ERRORS } from '../../../../lib/constants';
import { logger } from '../../../../lib/logger';
import { ErrorCode, mask } from '../../../../lib/utils';
import { $NextFunctionVer, $RequestExtend, IAuth, IStorageHandler } from '../../../../types';

const debug = buildDebug('verdaccio:token');
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
export default function (auth: IAuth, storage: IStorageHandler, config: Config): Router {
  const tokenRoute = Router(); /* eslint new-cap: 0 */
  tokenRoute.get(
    '/tokens',
    rateLimit(config?.userRateLimit),
    async function (req: $RequestExtend, res: Response, next: $NextFunctionVer) {
      const { name } = req.remote_user;

      if (_.isNil(name) === false) {
        try {
          const tokens = await storage.readTokens({ user: name });
          const totalTokens = tokens.length;
          debug('token list retrieved: %o', totalTokens);
          res.status(HTTP_STATUS.OK);
          return next({
            objects: tokens.map(normalizeToken),
            urls: {
              next: '', // TODO: pagination?
            },
          });
        } catch (error) {
          logger.error({ error: error.msg }, 'token list has failed: @{error}');
          return next(ErrorCode.getCode(HTTP_STATUS.INTERNAL_ERROR, error.message));
        }
      }
      return next(ErrorCode.getUnauthorized());
    }
  );

  tokenRoute.post(
    '/tokens',
    rateLimit(config?.userRateLimit),
    function (req: $RequestExtend, res: Response, next: $NextFunctionVer) {
      const { password, readonly, cidr_whitelist } = req.body;
      const { name } = req.remote_user;

      if (!_.isBoolean(readonly) || !_.isArray(cidr_whitelist)) {
        return next(ErrorCode.getCode(HTTP_STATUS.BAD_DATA, SUPPORT_ERRORS.PARAMETERS_NOT_VALID));
      }

      auth.authenticate(name, password, async (err, user: RemoteUser) => {
        if (err) {
          const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
          return next(ErrorCode.getCode(errorCode, err.message));
        }

        req.remote_user = user;

        if (!_.isFunction(storage.saveToken)) {
          return next(
            ErrorCode.getCode(HTTP_STATUS.NOT_IMPLEMENTED, SUPPORT_ERRORS.STORAGE_NOT_IMPLEMENT)
          );
        }

        try {
          const token = await getApiToken(auth, config, user, password);
          const key = stringToMD5(token);
          // TODO: use a utility here
          const maskedToken = mask(token, 5);
          const created = new Date().getTime();

          /**
           * cidr_whitelist: is not being used, we pass it through
           * token: we do not store the real token (it is generated once and retrieved to the user), just a mask of it.
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
          debug('token %o was created for user %o', key, name);
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
        } catch (error) {
          logger.error({ error: error.msg }, 'token creation has failed: @{error}');
          return next(ErrorCode.getCode(HTTP_STATUS.INTERNAL_ERROR, error.message));
        }
      });
    }
  );

  tokenRoute.delete(
    '/tokens/token/:tokenKey',
    rateLimit(config?.userRateLimit),
    async (req: $RequestExtend, res: Response, next: $NextFunctionVer) => {
      const {
        params: { tokenKey },
      } = req;
      const { name } = req.remote_user;

      if (_.isNil(name) === false) {
        debug('%o has requested remove a token', name);
        try {
          await storage.deleteToken(name, tokenKey);
          logger.info({ tokenKey, name }, 'token id @{tokenKey} was revoked for user @{name}');
          return next({});
        } catch (error) {
          logger.error({ error: error.msg }, 'token creation has failed: @{error}');
          return next(ErrorCode.getCode(HTTP_STATUS.INTERNAL_ERROR, error.message));
        }
      }
      return next(ErrorCode.getUnauthorized());
    }
  );

  return tokenRoute;
}
