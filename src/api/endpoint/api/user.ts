import express, { Response, Router } from 'express';
import _ from 'lodash';

import { getApiToken } from '@verdaccio/auth';
import { createRemoteUser } from '@verdaccio/config';
import { validationUtils } from '@verdaccio/core';
import { rateLimit } from '@verdaccio/middleware';
import { Config, RemoteUser } from '@verdaccio/types';
import { getAuthenticatedMessage } from '@verdaccio/utils';

import Auth from '../../../lib/auth';
import { API_ERROR, API_MESSAGE, HEADERS, HTTP_STATUS } from '../../../lib/constants';
import { logger } from '../../../lib/logger';
import { ErrorCode } from '../../../lib/utils';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../../../types';

export default function (route: Router, auth: Auth, config: Config): void {
  /* eslint new-cap:off */
  const userRouter = express.Router();

  userRouter.get(
    '/-/user/:org_couchdb_user',
    rateLimit(config?.userRateLimit),
    function (req: $RequestExtend, res: Response, next: $NextFunctionVer): void {
      res.status(HTTP_STATUS.OK);
      next({
        ok: getAuthenticatedMessage(req.remote_user.name),
      });
    }
  );

  userRouter.put(
    '/-/user/:org_couchdb_user/:_rev?/:revision?',
    rateLimit(config?.userRateLimit),
    function (req: $RequestExtend, res: Response, next: $NextFunctionVer): void {
      const { name, password } = req.body;
      const remoteName = req.remote_user.name;

      if (_.isNil(remoteName) === false && _.isNil(name) === false && remoteName === name) {
        auth.authenticate(
          name,
          password,
          async function callbackAuthenticate(err, user): Promise<void> {
            if (err) {
              logger.error(
                { name, err },
                'authenticating for user @{username} failed. Error: @{err.message}'
              );
              return next(
                ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, API_ERROR.BAD_USERNAME_PASSWORD)
              );
            }

            const restoredRemoteUser: RemoteUser = createRemoteUser(name, user?.groups ?? []);
            const token = await getApiToken(auth, config, restoredRemoteUser, password);

            res.status(HTTP_STATUS.CREATED);
            res.set(HEADERS.CACHE_CONTROL, 'no-cache, no-store');
            return next({
              ok: getAuthenticatedMessage(req.remote_user.name),
              token,
            });
          }
        );
      } else {
        if (validationUtils.validatePassword(password) === false) {
          // eslint-disable-next-line new-cap
          return next(ErrorCode.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.PASSWORD_SHORT));
        }

        auth.add_user(name, password, async function (err, user): Promise<void> {
          if (err) {
            if (err.status >= HTTP_STATUS.BAD_REQUEST && err.status < HTTP_STATUS.INTERNAL_ERROR) {
              // With npm registering is the same as logging in,
              // and npm accepts only an 409 error.
              // So, changing status code here.
              return next(
                ErrorCode.getCode(err.status, err.message) || ErrorCode.getConflict(err.message)
              );
            }
            return next(err);
          }

          const token =
            name && password ? await getApiToken(auth, config, user as RemoteUser, password) : undefined;

          req.remote_user = user;
          res.status(HTTP_STATUS.CREATED);
          res.set(HEADERS.CACHE_CONTROL, 'no-cache, no-store');
          return next({
            ok: `user '${req.body.name}' created`,
            token,
          });
        });
      }
    }
  );

  userRouter.delete(
    '/-/user/token/*',
    rateLimit(config?.userRateLimit),
    function (req: $RequestExtend, res: Response, next: $NextFunctionVer): void {
      res.status(HTTP_STATUS.OK);
      next({
        ok: API_MESSAGE.LOGGED_OUT,
      });
    }
  );

  route.use(userRouter);
}
