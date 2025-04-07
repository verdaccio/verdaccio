import buildDebug from 'debug';
import { Request, Response, Router } from 'express';
import _ from 'lodash';

import { Auth } from '@verdaccio/auth';
import {
  API_ERROR,
  APP_ERROR,
  HEADERS,
  HTTP_STATUS,
  VerdaccioError,
  errorUtils,
  validationUtils,
} from '@verdaccio/core';
import { rateLimit } from '@verdaccio/middleware';
import { WebUrls } from '@verdaccio/middleware';
import { Config, JWTSignOptions, RemoteUser } from '@verdaccio/types';

import { $NextFunctionVer } from './package';

const debug = buildDebug('verdaccio:web:api:user');

function addUserAuthApi(auth: Auth, config: Config): Router {
  const route = Router(); /* eslint new-cap: 0 */
  route.post(
    WebUrls.user_login,
    rateLimit(config?.userRateLimit),
    function (req: Request, res: Response, next: $NextFunctionVer): void {
      const { username, password } = req.body;
      debug('authenticate %o', username);
      auth.authenticate(
        username,
        password,
        async (err: VerdaccioError | null, user?: RemoteUser): Promise<void> => {
          if (err) {
            const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
            debug('error authenticate %o', errorCode);
            next(errorUtils.getCode(errorCode, err.message));
          } else {
            req.remote_user = user as RemoteUser;
            const jWTSignOptions: JWTSignOptions = config.security.web.sign;
            res.set(HEADERS.CACHE_CONTROL, 'no-cache, no-store');
            next({
              token: await auth.jwtEncrypt(user as RemoteUser, jWTSignOptions),
              username: req.remote_user.name,
            });
          }
        }
      );
    }
  );

  if (config?.flags?.changePassword === true) {
    route.put(
      WebUrls.reset_password,
      rateLimit(config?.userRateLimit),
      function (req: Request, res: Response, next: $NextFunctionVer): void {
        if (_.isNil(req.remote_user.name)) {
          res.status(HTTP_STATUS.UNAUTHORIZED);
          return next({
            // FUTURE: update to a more meaningful message
            message: API_ERROR.MUST_BE_LOGGED,
          });
        }

        const { password } = req.body;
        const { name } = req.remote_user;

        if (
          validationUtils.validatePassword(
            password.new,
            config?.serverSettings?.passwordValidationRegex
          ) === false
        ) {
          return next(errorUtils.getCode(HTTP_STATUS.BAD_REQUEST, APP_ERROR.PASSWORD_VALIDATION));
        }

        auth.changePassword(name as string, password.old, password.new, (err, isUpdated): void => {
          if (_.isNil(err) && isUpdated) {
            next({
              ok: true,
            });
          } else {
            return next(errorUtils.getInternalError(API_ERROR.INTERNAL_SERVER_ERROR));
          }
        });
      }
    );
  }

  return route;
}

export default addUserAuthApi;
