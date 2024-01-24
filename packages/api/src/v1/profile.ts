import { Response, Router } from 'express';
import _ from 'lodash';

import { Auth } from '@verdaccio/auth';
import {
  API_ERROR,
  APP_ERROR,
  HTTP_STATUS,
  SUPPORT_ERRORS,
  errorUtils,
  validatioUtils,
} from '@verdaccio/core';
import { rateLimit } from '@verdaccio/middleware';
import { Config } from '@verdaccio/types';

import { $NextFunctionVer, $RequestExtend } from '../../types/custom';

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

export default function (route: Router, auth: Auth, config: Config): void {
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

  route.get(
    '/-/npm/v1/user',
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

  route.post(
    '/-/npm/v1/user',
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
        if (
          validatioUtils.validatePassword(
            password.new,
            config?.serverSettings?.passwordValidationRegex
          ) === false
        ) {
          /* eslint new-cap:off */
          return next(errorUtils.getCode(HTTP_STATUS.UNAUTHORIZED, API_ERROR.PASSWORD_SHORT));
          /* eslint new-cap:off */
        }

        auth.changePassword(
          name,
          password.old,
          password.new,
          (err, isUpdated): $NextFunctionVer => {
            if (_.isNull(err) === false) {
              return next(errorUtils.getForbidden(err.message));
            }

            if (isUpdated) {
              return next(buildProfile(req.remote_user.name));
            }
            return next(errorUtils.getInternalError(API_ERROR.INTERNAL_SERVER_ERROR));
          }
        );
      } else if (_.isNil(tfa) === false) {
        return next(
          errorUtils.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.TFA_DISABLED)
        );
      } else {
        return next(errorUtils.getCode(HTTP_STATUS.INTERNAL_ERROR, APP_ERROR.PROFILE_ERROR));
      }
    }
  );
}
