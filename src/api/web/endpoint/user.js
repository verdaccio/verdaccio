/**
 * @prettier
 * @flow
 */

import _ from 'lodash';
import { API_ERROR, APP_ERROR, HTTP_STATUS } from '../../../lib/constants';

import type { Router } from 'express';
import type { Config, RemoteUser, JWTSignOptions } from '@verdaccio/types';
import type { IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer } from '../../../../types';
import { ErrorCode } from '../../../lib/utils';
import { getSecurity, validatePassword } from '../../../lib/auth-utils';

function addUserAuthApi(route: Router, auth: IAuth, config: Config) {
  route.post('/login', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const { username, password } = req.body;

    auth.authenticate(username, password, async (err, user: RemoteUser) => {
      if (err) {
        const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
        next(ErrorCode.getCode(errorCode, err.message));
      } else {
        req.remote_user = user;
        const jWTSignOptions: JWTSignOptions = getSecurity(config).web.sign;

        next({
          token: await auth.jwtEncrypt(user, jWTSignOptions),
          username: req.remote_user.name,
        });
      }
    });
  });

  route.put('/reset_password', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    if (_.isNil(req.remote_user.name)) {
      res.status(HTTP_STATUS.UNAUTHORIZED);
      return next({
        // FUTURE: update to a more meaningful message
        message: API_ERROR.MUST_BE_LOGGED,
      });
    }

    const { password } = req.body;
    const { name } = req.remote_user;

    if (validatePassword(password.new) === false) {
      auth.changePassword(name, password.old, password.new, (err, isUpdated) => {
        if (_.isNil(err) && isUpdated) {
          next({
            ok: true,
          });
        } else {
          return next(ErrorCode.getInternalError(API_ERROR.INTERNAL_SERVER_ERROR));
        }
      });
    } else {
      return next(ErrorCode.getCode(HTTP_STATUS.BAD_REQUEST, APP_ERROR.PASSWORD_VALIDATION));
    }
  });
}

export default addUserAuthApi;
