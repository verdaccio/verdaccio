import type { Response, Router } from 'express';
import { isEmpty, isNil } from 'lodash-es';

import type { Auth, TfaMode, TfaStatus } from '@verdaccio/auth';
import { TfaStore } from '@verdaccio/auth';
import {
  API_ERROR,
  APP_ERROR,
  HTTP_STATUS,
  SUPPORT_ERRORS,
  errorUtils,
  validationUtils,
} from '@verdaccio/core';
import { PROFILE_API_ENDPOINTS, rateLimit } from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Config, Logger } from '@verdaccio/types';

import type { $NextFunctionVer, $RequestExtend } from '../../types/custom';

const TFA_MODES: TfaMode[] = ['auth-only', 'auth-and-writes'];

export interface Profile {
  /**
   * `false` when two-factor is off, otherwise the mode and whether enrolment is
   * still half-finished. `npm profile` reads `tfa.mode` and `tfa.pending`.
   */
  tfa: TfaStatus;
  name: string;
  email: string;
  email_verified: boolean;
  created: string;
  updated: string;
  cidr_whitelist: string[] | null;
  fullname: string;
}

export default function (
  route: Router,
  auth: Auth,
  config: Config,
  storage?: Storage,
  logger?: Logger
): void {
  // only built when the flag is on: without it nothing must touch the token store
  const tfaStore =
    config.flags?.tfa && storage && logger
      ? new TfaStore(storage, config.secret, logger)
      : undefined;

  function buildProfile(name: string, tfa: TfaStatus = false): Profile {
    return {
      tfa,
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
    PROFILE_API_ENDPOINTS.get_profile,
    rateLimit(config?.userRateLimit),
    async function (req: $RequestExtend, res: Response, next: $NextFunctionVer): Promise<void> {
      const { name } = req.remote_user;
      if (isNil(name)) {
        res.status(HTTP_STATUS.UNAUTHORIZED);
        return next({
          message: API_ERROR.MUST_BE_LOGGED,
        });
      }

      try {
        const tfa = tfaStore ? await tfaStore.status(name) : false;
        return next(buildProfile(name, tfa));
      } catch (err) {
        return next(err);
      }
    }
  );

  /** Promisified `auth.authenticate`, used to re-check the password. */
  function verifyPassword(username: string, password: unknown): Promise<boolean> {
    if (typeof password !== 'string' || isEmpty(password)) {
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      auth.authenticate(username, password, (err) => resolve(!err));
    });
  }

  /**
   * The `tfa` body of `POST /-/npm/v1/user`, in the three shapes `npm profile`
   * sends:
   *
   *   { mode, password }              start enrolment  -> { tfa: 'otpauth://...' }
   *   [ '123456' ]                    finish enrolment -> { tfa: [recovery codes] }
   *   { mode: 'disable', password }   turn it off      -> the profile
   *
   * Step two must answer with a plain string: the CLI checks
   * `/^otpauth:[/][/]/` and aborts otherwise. Step three must answer with an
   * array, which the CLI prints as the recovery codes.
   */
  async function handleTfa(tfa: any, name: string, next: $NextFunctionVer): Promise<void> {
    const store = tfaStore as TfaStore;

    // finish enrolment: `{ tfa: ['123456'] }`
    if (Array.isArray(tfa)) {
      const [code] = tfa;
      const recoveryCodes = await store.completeEnrolment(name, String(code ?? ''));
      if (!recoveryCodes) {
        return next(errorUtils.getUnauthorized('invalid one-time password'));
      }
      return next({ tfa: recoveryCodes });
    }

    if (typeof tfa !== 'object' || tfa === null) {
      return next(errorUtils.getBadRequest('unsupported two-factor payload'));
    }

    const { mode, password } = tfa;
    if (!(await verifyPassword(name, password))) {
      return next(errorUtils.getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD));
    }

    if (mode === 'disable') {
      await store.disable(name);
      logger?.info({ name }, 'two-factor authentication disabled for @{name}');
      return next(buildProfile(name, false));
    }

    if (TFA_MODES.includes(mode) === false) {
      return next(
        errorUtils.getBadRequest(`two-factor mode must be one of ${TFA_MODES.join(', ')}`)
      );
    }

    const { otpauthUrl } = await store.beginEnrolment(name, mode, config.web?.title ?? 'Verdaccio');
    logger?.info({ name, mode }, 'two-factor enrolment started for @{name} in mode @{mode}');
    return next({ tfa: otpauthUrl });
  }

  route.post(
    PROFILE_API_ENDPOINTS.get_profile,
    rateLimit(config?.userRateLimit),
    function (req: $RequestExtend, res: Response, next: $NextFunctionVer): void {
      if (isNil(req.remote_user.name)) {
        res.status(HTTP_STATUS.UNAUTHORIZED);
        return next({
          message: API_ERROR.MUST_BE_LOGGED,
        });
      }

      const { password, tfa } = req.body;
      const { name } = req.remote_user;

      if (isNil(password) === false) {
        if (
          validationUtils.validatePassword(
            password.new,
            config?.server?.passwordValidationRegex
          ) === false
        ) {
          /* eslint new-cap:off */
          return next(errorUtils.getCode(HTTP_STATUS.UNAUTHORIZED, API_ERROR.PASSWORD_SHORT));
        }

        if (isEmpty(password.old)) {
          return next(errorUtils.getBadRequest('old password is required'));
        }

        auth.changePassword(
          name,
          password.old,
          password.new,
          (err, isUpdated): $NextFunctionVer => {
            if (err !== null) {
              return next(errorUtils.getForbidden(err.message));
            }

            if (isUpdated) {
              return next(buildProfile(req.remote_user.name));
            }
            return next(errorUtils.getInternalError(API_ERROR.INTERNAL_SERVER_ERROR));
          }
        );
      } else if (isNil(tfa) === false) {
        if (!tfaStore) {
          return next(
            errorUtils.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.TFA_DISABLED)
          );
        }
        handleTfa(tfa, name, next).catch(next);
      } else {
        return next(errorUtils.getCode(HTTP_STATUS.INTERNAL_ERROR, APP_ERROR.PROFILE_ERROR));
      }
    }
  );
}
