/**
 * @prettier
 */
import _ from 'lodash';

import express, { Router, Response, Request } from 'express';
import { Config, RemoteUser, JWTSignOptions } from '@verdaccio/types';
import { API_ERROR, APP_ERROR, HEADERS, HTTP_STATUS } from '../../../lib/constants';
import { IAuth, $NextFunctionVer } from '../../../../types';
import { ErrorCode } from '../../../lib/utils';
import { getSecurity, validatePassword } from '../../../lib/auth-utils';
import { limiter } from '../../user-rate-limit';

function addUserAuthApi(route: Router, auth: IAuth, config: Config): void {
  route.use(limiter(config?.userRateLimit));
  route.post('/login', function (req: Request, res: Response, next: $NextFunctionVer): void {
    const { username, password } = req.body;

    auth.authenticate(username, password, async (err, user: RemoteUser): Promise<void> => {
      if (err) {
        const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
        next(ErrorCode.getCode(errorCode, err.message));
      } else {
        req.remote_user = user;
        const jWTSignOptions: JWTSignOptions = getSecurity(config).web.sign;
        res.set(HEADERS.CACHE_CONTROL, 'no-cache, no-store');
        next({
          token: await auth.jwtEncrypt(user, jWTSignOptions),
          username: req.remote_user.name,
        });
      }
    });
  });

  route.put('/reset_password', function (req: Request, res: Response, next: $NextFunctionVer): void {
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
      auth.changePassword(name as string, password.old, password.new, (err, isUpdated): void => {
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
