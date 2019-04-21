/**
 * @prettier
 */

// @flow

import _ from 'lodash';
import { HTTP_STATUS, SUPPORT_ERRORS } from '../../../../lib/constants';
import { ErrorCode, mask } from '../../../../lib/utils';
import { getApiToken } from '../../../../lib/auth-utils';
import { stringToMD5 } from '../../../../lib/crypto-utils';
import logger from '../../../../lib/logger';

import type { $Response, Router } from 'express';
import type { $NextFunctionVer, $RequestExtend, IAuth } from '../../../../../types';

// https://github.com/npm/npm-profile/blob/latest/lib/index.js
export default function(route: Router, auth: IAuth, storage: IStorageHandler, config: Config) {
  route.get('/-/npm/v1/tokens', function(req: $RequestExtend, res: $Response, next: $NextFunctionVer) {
    /**
     * table.push([
        token.id,
        token.token + '…',
        String(token.created).slice(0, 10),
        token.readonly ? 'yes' : 'no',
        token.cidr_whitelist ? token.cidr_whitelist.join(', ') : ''
      ])
     */
    const fake = [
      {
        token: '1232f6',
        key: 'key2',
        cidr_whitelist: null,
        readonly: false,
        created: '2018-10-05T21:49:39.457Z',
        updated: '2018-10-05T21:49:39.457Z',
      },
      {
        token: '12b000',
        key: 'key2',
        cidr_whitelist: null,
        readonly: false,
        created: '2018-08-04T09:04:17.194Z',
        updated: '2018-08-04T09:04:17.194Z',
      },
    ];

    res.status(HTTP_STATUS.OK);
    // return next({ message: API_ERROR.MUST_BE_LOGGED });
    next({
      objects: fake,
      urls: {
        next: '', // TODO pagination
      },
    });
  });

  route.post('/-/npm/v1/tokens', function(req: $RequestExtend, res: $Response, next: $NextFunctionVer) {
    const { password, readonly, cidr_whitelist } = req.body;
    const { name } = req.remote_user;

    if (!_.isBoolean(readonly) || !_.isArray(cidr_whitelist)) {
      next(ErrorCode.getCode(HTTP_STATUS.BAD_DATA, SUPPORT_ERRORS.PARAMETERS_NOT_VALID));
      return;
    }

    auth.authenticate(name, password, async (err, user: RemoteUser) => {
      if (err) {
        const errorCode = err.message ? HTTP_STATUS.UNAUTHORIZED : HTTP_STATUS.INTERNAL_ERROR;
        next(ErrorCode.getCode(errorCode, err.message));
      } else {
        req.remote_user = user;

        if (!_.isFunction(storage.saveToken)) {
          next(ErrorCode.getCode(HTTP_STATUS.NOT_IMPLEMENTED, SUPPORT_ERRORS.STORAGE_NOT_IMPLEMENT));
          return;
        }

        try {
          const token = await getApiToken(auth, config, user, password);
          const key = stringToMD5(token);

          const saveToken = {
            user: name,
            viewToken: mask(token),
            key,
            cidr: cidr_whitelist,
            readonly,
            created: new Date(),
          };

          await storage.saveToken(saveToken);
          return next({
            token,
            key: saveToken.key,
            cidr_whitelist,
            readonly,
            created: saveToken.created,
          });
        } catch (error) {
          logger.logger.error({ error }, 'token creation has failed: @{error}');
          next(ErrorCode.getCode(HTTP_STATUS.INTERNAL_ERROR, error.message));
        }
      }
    });
  });

  route.delete('/-/npm/v1/tokens/token/:tokenKey', function(req: $RequestExtend, res: $Response, next: $NextFunctionVer) {
    // req.params
    next();
    // return next(ErrorCode.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE));
  });
}
