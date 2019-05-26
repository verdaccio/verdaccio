/**
 * @prettier
 */

// @flow

import _ from 'lodash';
import { API_ERROR, APP_ERROR, HTTP_STATUS, SUPPORT_ERRORS } from '../../../../lib/constants';
import { ErrorCode } from '../../../../lib/utils';
import { validatePassword } from '../../../../lib/auth-utils';

import { Response, Router } from 'express';
import { $NextFunctionVer, $RequestExtend, IAuth } from '../../../../../types';

export default function(route: Router, auth: IAuth) {
  const buildProfile = name => ({
    tfa: false,
    name,
    email: '',
    email_verified: false,
    created: '',
    updated: '',
    cidr_whitelist: null,
    fullname: '',
  });

  route.get('/-/npm/v1/user', function(req: $RequestExtend, res: Response, next: $NextFunctionVer) {
    if (_.isNil(req.remote_user.name) === false) {
      return next(buildProfile(req.remote_user.name));
    }

    res.status(HTTP_STATUS.UNAUTHORIZED);
    return next({
      message: API_ERROR.MUST_BE_LOGGED,
    });
  });

  route.post('/-/npm/v1/user', function(req: $RequestExtend, res: Response, next: $NextFunctionVer) {
    if (_.isNil(req.remote_user.name)) {
      res.status(HTTP_STATUS.UNAUTHORIZED);
      return next({
        message: API_ERROR.MUST_BE_LOGGED,
      });
    }

    const { password, tfa } = req.body;
    const { name } = req.remote_user;

    if (_.isNil(password) === false) {
      if (validatePassword(password.new) === false) {
        /* eslint new-cap:off */
        return next(ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, API_ERROR.PASSWORD_SHORT()));
        /* eslint new-cap:off */
      }

      auth.changePassword(name, password.old, password.new, (err, isUpdated) => {
        if (_.isNull(err) === false) {
          return next(ErrorCode.getCode(err.status, err.message) || ErrorCode.getConflict(err.message));
        }

        if (isUpdated) {
          return next(buildProfile(req.remote_user.name));
        } else {
          return next(ErrorCode.getInternalError(API_ERROR.INTERNAL_SERVER_ERROR));
        }
      });
    } else if (_.isNil(tfa) === false) {
      return next(ErrorCode.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.TFA_DISABLED));
    } else {
      return next(ErrorCode.getCode(HTTP_STATUS.INTERNAL_ERROR, APP_ERROR.PROFILE_ERROR));
    }
  });
}
