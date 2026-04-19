import buildDebug from 'debug';
import type { Request, Response } from 'express';
import { Router } from 'express';
import { isNil } from 'lodash-es';

import { type Auth, getApiToken } from '@verdaccio/auth';
import type { VerdaccioError } from '@verdaccio/core';
import {
  API_ERROR,
  APP_ERROR,
  HEADERS,
  HTTP_STATUS,
  TOKEN_BEARER,
  cryptoUtils,
  errorUtils,
  validationUtils,
} from '@verdaccio/core';
import { WebUrls, rateLimit } from '@verdaccio/middleware';
import type { Config, JWTSignOptions, RemoteUser } from '@verdaccio/types';

import type { $NextFunctionVer } from './package';

const debug = buildDebug('verdaccio:web:api:user');

const WEB_LOGIN_SESSION_ID = 'web-login-sessionId';

function addUserAuthApi(auth: Auth, config: Config, storage: Storage): Router {
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
            // Prevent the final middleware from adding WWW-Authenticate header,
            // which triggers the browser's native basic auth popup instead of
            // letting the WebUI handle the error in JavaScript.
            if (errorCode === HTTP_STATUS.UNAUTHORIZED) {
              res.set(HEADERS.WWW_AUTH, TOKEN_BEARER);
            }
            return next(errorUtils.getCode(errorCode, err.message));
          } else {
            req.remote_user = user as RemoteUser;
            const jWTSignOptions: JWTSignOptions = config.security.web.sign;
            res.set(HEADERS.CACHE_CONTROL, HEADERS.NO_CACHE);
            return next({
              token: await auth.jwtEncrypt(user as RemoteUser, jWTSignOptions),
              username: req.remote_user.name,
            });
          }
        }
      );
    }
  );

  if (config?.flags?.createUser === true) {
    route.put(
      WebUrls.user_signup,
      rateLimit(config?.userRateLimit),
      function (req: Request, res: Response, next: $NextFunctionVer): void {
        const { name, password, email, sessionId } = req.body;
        debug('login or adduser');

        // TOOD: reuse with login.ts file
        if (typeof sessionId !== 'string' || sessionId.length !== 36) {
          debug('sessionId is invalid length: %o', sessionId.length);
          return next(errorUtils.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.SESSION_ID_INVALID));
        }

        if (!name || !password || !email) {
          return next(errorUtils.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.BAD_DATA));
        }

        auth.add_user(name, password, async function (err, user): Promise<void> {
          if (err) {
            if (err.status >= HTTP_STATUS.BAD_REQUEST && err.status < HTTP_STATUS.INTERNAL_ERROR) {
              debug('adduser: error on create user');
              // With npm registering is the same as logging in,
              // and npm accepts only an 409 error.
              // So, changing status code here.
              return next(
                errorUtils.getCode(err.status, err.message) || errorUtils.getConflict(err.message)
              );
            }
            return next(err);
          }

          const tokens = await storage.readTokens({ user: sessionId });
          debug('tokens found for sessionId %o: %o', sessionId, tokens.length);
          if (tokens && tokens.length === 1 && tokens[0].key === WEB_LOGIN_SESSION_ID) {
            if (tokens[0].token.length === 0) {
              debug('waiting for authentication');
              // Poll again after short delay
              // TODO: make this configurable (default 5 seconds)
              res.status(HTTP_STATUS.ACCEPTED);
              res.set(HEADERS.RETRY_AFTER, '5');
              res.json({});
              return;
            }

            // session token can only be used once
            debug('deleting session token');
            await storage.deleteToken(sessionId, tokens[0].key);

            // Check if token has expired
            // TODO: make this configurable (default 2 minutes)
            const tokenCreatedDate = new Date(tokens[0].created);
            const minutesAgo = new Date(Date.now() - 2 * 60 * 1000);
            if (tokenCreatedDate < minutesAgo) {
              debug('session token expired');
              return next(errorUtils.getUnauthorized(API_ERROR.SESSION_TOKEN_EXPIRED));
            }

            debug('session token is valid, login successful');
            res.status(HTTP_STATUS.OK);
            res.json({ token: tokens[0].token });
            return;
          }

          const token =
            name && password
              ? await getApiToken(auth, config, user as RemoteUser, password)
              : undefined;
          if (token) {
            debug('adduser: new token %o', cryptoUtils.mask(token as string, 4));
            return next({ token, username: name });
          }
          return next(errorUtils.getUnauthorized());
        });
      }
    );
  }

  if (config?.flags?.changePassword === true) {
    route.put(
      WebUrls.reset_password,
      rateLimit(config?.userRateLimit),
      function (req: Request, res: Response, next: $NextFunctionVer): void {
        if (isNil(req.remote_user.name)) {
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
            config?.server?.passwordValidationRegex
          ) === false
        ) {
          return next(errorUtils.getCode(HTTP_STATUS.BAD_REQUEST, APP_ERROR.PASSWORD_VALIDATION));
        }

        auth.changePassword(name as string, password.old, password.new, (err, isUpdated): void => {
          if (isNil(err) && isUpdated) {
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
