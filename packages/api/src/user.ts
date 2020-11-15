import _ from 'lodash';
import { Response, Router } from 'express';
import buildDebug from 'debug';

import { getAuthenticatedMessage, validatePassword, ErrorCode } from '@verdaccio/utils';
import { getApiToken } from '@verdaccio/auth';
import { logger } from '@verdaccio/logger';
import { createRemoteUser } from '@verdaccio/config';

import { Config, RemoteUser } from '@verdaccio/types';
import { IAuth } from '@verdaccio/auth';
import { API_ERROR, API_MESSAGE, HTTP_STATUS } from '@verdaccio/commons-api';
import { $RequestExtend, $NextFunctionVer } from '../types/custom';

const debug = buildDebug('verdaccio:api:user');

export default function (route: Router, auth: IAuth, config: Config): void {
  route.get('/-/user/:org_couchdb_user', function (
    req: $RequestExtend,
    res: Response,
    next: $NextFunctionVer
  ): void {
    debug('verifying user');
    const message = getAuthenticatedMessage(req.remote_user.name);
    debug('user authenticated message %o', message);
    res.status(HTTP_STATUS.OK);
    next({
      ok: message,
    });
  });

  route.put('/-/user/:org_couchdb_user/:_rev?/:revision?', function (
    req: $RequestExtend,
    res: Response,
    next: $NextFunctionVer
  ): void {
    const { name, password } = req.body;
    debug('login or adduser');
    const remoteName = req.remote_user.name;

    if (_.isNil(remoteName) === false && _.isNil(name) === false && remoteName === name) {
      debug('login: no remote user detected');
      auth.authenticate(name, password, async function callbackAuthenticate(
        err,
        user
      ): Promise<void> {
        if (err) {
          logger.trace(
            { name, err },
            'authenticating for user @{username} failed. Error: @{err.message}'
          );
          return next(ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, API_ERROR.BAD_USERNAME_PASSWORD));
        }

        const restoredRemoteUser: RemoteUser = createRemoteUser(name, user.groups || []);
        const token = await getApiToken(auth, config, restoredRemoteUser, password);
        debug('login: new token');
        if (!token) {
          return next(ErrorCode.getUnauthorized());
        }

        res.status(HTTP_STATUS.CREATED);

        const message = getAuthenticatedMessage(req.remote_user.name);
        debug('login: created user message %o', message);

        return next({
          ok: message,
          token,
        });
      });
    } else {
      if (validatePassword(password) === false) {
        debug('adduser: invalid password');
        // eslint-disable-next-line new-cap
        return next(ErrorCode.getCode(HTTP_STATUS.BAD_REQUEST, API_ERROR.PASSWORD_SHORT()));
      }

      auth.add_user(name, password, async function (err, user): Promise<void> {
        if (err) {
          if (err.status >= HTTP_STATUS.BAD_REQUEST && err.status < HTTP_STATUS.INTERNAL_ERROR) {
            debug('adduser: error on create user');
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
          name && password ? await getApiToken(auth, config, user, password) : undefined;
        debug('adduser: new token %o', token);
        if (!token) {
          return next(ErrorCode.getUnauthorized());
        }

        req.remote_user = user;
        res.status(HTTP_STATUS.CREATED);
        debug('adduser: user has been created');
        return next({
          ok: `user '${req.body.name}' created`,
          token,
        });
      });
    }
  });

  route.delete('/-/user/token/*', function (
    req: $RequestExtend,
    res: Response,
    next: $NextFunctionVer
  ): void {
    res.status(HTTP_STATUS.OK);
    next({
      ok: API_MESSAGE.LOGGED_OUT,
    });
  });
}
