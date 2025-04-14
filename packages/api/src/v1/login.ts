import buildDebug from 'debug';
import { Response, Router } from 'express';
import { randomUUID } from 'node:crypto';

import { Auth, getApiToken } from '@verdaccio/auth';
import { createRemoteUser } from '@verdaccio/config';
import { API_ERROR, HEADERS, HTTP_STATUS, errorUtils } from '@verdaccio/core';
import { LOGIN_API_ENDPOINTS, rateLimit } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Config, Logger } from '@verdaccio/types';
import { getAuthenticatedMessage } from '@verdaccio/utils';

import { $NextFunctionVer, $RequestExtend } from '../../types/custom';

const debug = buildDebug('verdaccio:api:login');

const WEB_LOGIN_SESSION_ID = 'web-login-sessionId';

// https://github.com/npm/npm-profile/blob/main/lib/index.js
export default function (
  route: Router,
  auth: Auth,
  storage: Storage,
  config: Config,
  logger: Logger
): void {
  route.post(
    LOGIN_API_ENDPOINTS.login,
    rateLimit(config?.userRateLimit),
    async function (req: $RequestExtend, res: Response): Promise<void> {
      // create new login session (without token)
      const sessionId = randomUUID();
      debug('creating login session %o', sessionId);

      await storage.saveToken({
        user: sessionId,
        token: '',
        key: WEB_LOGIN_SESSION_ID,
        readonly: false,
        created: new Date().toISOString(),
      });

      res.status(HTTP_STATUS.OK);

      // Assuming Web UI is running on the same address as API
      const protocol = req.protocol;
      const host = req.hostname;
      const port = req.socket.localPort;

      const loginUrl = `${protocol}://${host}:${port}/-/web/login?next=${LOGIN_API_ENDPOINTS.login_cli}/${sessionId}`;
      const doneUrl = `${protocol}://${host}:${port}${LOGIN_API_ENDPOINTS.login_done}/${sessionId}`;
      debug('loginUrl: %o', loginUrl);
      debug('doneUrl: %o', doneUrl);

      res.json({
        loginUrl,
        doneUrl,
      });
    }
  );

  route.get(
    LOGIN_API_ENDPOINTS.login_done_session,
    rateLimit(config?.userRateLimit),
    async function (req: $RequestExtend, res: Response, next: $NextFunctionVer): Promise<void> {
      debug('polling login session %o', req.params.sessionId);

      if (!req.params.sessionId) {
        return next(errorUtils.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.SESSION_ID_REQUIRED));
      }
      const sessionId = req.params.sessionId;
      if (sessionId.length !== 36) {
        return next(errorUtils.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.SESSION_ID_INVALID));
      }

      try {
        const tokens = await storage.readTokens({ user: sessionId });

        if (tokens && tokens.length === 1 && tokens[0].key === WEB_LOGIN_SESSION_ID) {
          if (tokens[0].token.length === 0) {
            debug('waiting for authentication');
            // Poll again after short delay
            // TODO: make this configurable (default 5 seconds)
            res.status(HTTP_STATUS.ACCEPTED);
            res.set(HEADERS.RETRY_AFTER, '5');
            res.json({});
          } else {
            // session token can only be used once
            await storage.deleteToken(sessionId, tokens[0].key);

            // Check if token has expired
            // TODO: make this configurable (default 5 min)
            const tokenCreatedDate = new Date(tokens[0].created);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            if (tokenCreatedDate < fiveMinutesAgo) {
              debug('session token expired');
              return next(errorUtils.getUnauthorized(API_ERROR.SESSION_TOKEN_EXPIRED));
            }

            debug('session token is valid, login successful');

            res.status(HTTP_STATUS.OK);
            res.json({ token: tokens[0].token });
          }
        } else {
          return next(errorUtils.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.SESSION_ID_INVALID));
        }
      } catch (error: any) {
        logger.error({ error: error.msg }, 'token list has failed: @{error}');
        return next(errorUtils.getCode(HTTP_STATUS.INTERNAL_ERROR, error.message));
      }
    }
  );

  route.post(
    LOGIN_API_ENDPOINTS.login_cli_session,
    rateLimit(config?.userRateLimit),
    async function (req: $RequestExtend, res: Response, next: $NextFunctionVer): Promise<void> {
      const { username, password } = req.body;
      debug('authenticating login session %o for user %o', req.params.sessionId, username);

      if (!req.params.sessionId) {
        return next(errorUtils.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.SESSION_ID_REQUIRED));
      }
      const sessionId = req.params.sessionId;
      if (sessionId.length !== 36) {
        return next(errorUtils.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.SESSION_ID_INVALID));
      }

      auth.authenticate(
        username,
        password,
        async function callbackAuthenticate(err, user): Promise<void> {
          if (err) {
            logger.trace(
              { username, err },
              'authenticating for user @{username} failed. Error: @{err.message}'
            );
            return next(errorUtils.getCode(HTTP_STATUS.UNAUTHORIZED, err.message));
          }

          const remoteUser = createRemoteUser(username, user?.groups || []);
          const token = await getApiToken(auth, config, remoteUser, password);

          if (!token) {
            return next(errorUtils.getUnauthorized());
          }

          // Replace login session with token (to be picked up by the "done" endpoint)
          await storage.deleteToken(sessionId, WEB_LOGIN_SESSION_ID);
          await storage.saveToken({
            user: sessionId,
            token,
            key: WEB_LOGIN_SESSION_ID,
            readonly: false,
            created: new Date().toISOString(),
          });

          const message = getAuthenticatedMessage(remoteUser.name ?? '');

          res.status(HTTP_STATUS.CREATED);
          res.set(HEADERS.CACHE_CONTROL, 'no-cache, no-store');
          res.json({ ok: message });
        }
      );
    }
  );
}
