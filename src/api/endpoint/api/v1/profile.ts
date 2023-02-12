import { Response, Router } from 'express';
import _ from 'lodash';

import { rateLimit } from '@verdaccio/middleware';

import { validatePassword } from '../../../../lib/auth-utils';
import { API_ERROR, APP_ERROR, HTTP_STATUS, SUPPORT_ERRORS } from '../../../../lib/constants';
import { ErrorCode } from '../../../../lib/utils';
import { $NextFunctionVer, $RequestExtend, IAuth } from '../../../../types';

export interface Profile {
  tfa: boolean;
  name: string;
  email: string;
  email_verified: boolean;
  created: string;
  updated: string;
  cidr_whitelist: string[] | null;
  fullname: string;
}

export default function (auth: IAuth, config): Router {
  const profileRoute = Router(); /* eslint new-cap: 0 */
  function buildProfile(name: string): Profile {
    return {
      tfa: false,
      name,
      email: '',
      email_verified: false,
      created: '',
      updated: '',
      cidr_whitelist: null,
      fullname: '',
    };
  }

  profileRoute.get(
    '/user',
    rateLimit(config?.userRateLimit),
    function (req: $RequestExtend, res: Response, next: $NextFunctionVer): void {
      if (_.isNil(req.remote_user.name) === false) {
        return next(buildProfile(req.remote_user.name));
      }

      res.status(HTTP_STATUS.UNAUTHORIZED);
      return next({
        message: API_ERROR.MUST_BE_LOGGED,
      });
    }
  );

  profileRoute.post(
    '/user',
    rateLimit(config?.userRateLimit),
    function (req: $RequestExtend, res: Response, next: $NextFunctionVer): void {
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
          return next(ErrorCode.getCode(HTTP_STATUS.UNAUTHORIZED, API_ERROR.PASSWORD_SHORT));
          /* eslint new-cap:off */
        }

        auth.changePassword(
          name,
          password.old,
          password.new,
          (err, isUpdated): $NextFunctionVer => {
            if (_.isNull(err) === false) {
              return next(
                ErrorCode.getCode(err.status, err.message) || ErrorCode.getConflict(err.message)
              );
            }

            if (isUpdated) {
              return next(buildProfile(req.remote_user.name));
            }
            return next(ErrorCode.getInternalError(API_ERROR.INTERNAL_SERVER_ERROR));
          }
        );
      } else if (_.isNil(tfa) === false) {
        return next(
          ErrorCode.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.TFA_DISABLED)
        );
      } else {
        return next(ErrorCode.getCode(HTTP_STATUS.INTERNAL_ERROR, APP_ERROR.PROFILE_ERROR));
      }
    }
  );

  return profileRoute;
}
