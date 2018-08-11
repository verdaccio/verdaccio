// @flow

import {HTTP_STATUS} from '../../../lib/constants';

import type {Router} from 'express';
import type {Config, RemoteUser, JWTSignOptions} from '@verdaccio/types';
import type {IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer} from '../../../../types';
import {ErrorCode} from '../../../lib/utils';
import {getSecurity} from '../../../lib/auth-utils';

function addUserAuthApi(route: Router, auth: IAuth, config: Config) {
  route.post('/login', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    const {username, password} = req.body;

    auth.authenticate(username, password, (err, user: RemoteUser) => {
      if (err) {
        const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
        next(ErrorCode.getCode(errorCode, err.message));
      } else {
        req.remote_user = user;
        const jWTSignOptions: JWTSignOptions = getSecurity(config).web.sign;

        next({
          token: auth.jwtEncrypt(user, jWTSignOptions),
          username: req.remote_user.name,
        });
      }
    });
  });
}

export default addUserAuthApi;
