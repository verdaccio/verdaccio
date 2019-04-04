/**
 * @prettier
 */

// @flow

// import _ from 'lodash';
// import { API_ERROR, APP_ERROR, HTTP_STATUS, SUPPORT_ERRORS } from '../../../../lib/constants';
import { HTTP_STATUS } from '../../../../lib/constants';
import { allow } from '../../../middleware';
// import { ErrorCode } from '../../../../lib/utils';
// import { validatePassword } from '../../../../lib/auth-utils';

import type { $Response, Router } from 'express';
import type { $NextFunctionVer, $RequestExtend, IAuth } from '../../../../../types';

// https://github.com/npm/npm-profile/blob/latest/lib/index.js
export default function(route: Router, auth: IAuth, storage: IStorageHandler, config: Config) {
  const can = allow(auth);

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
    /**
    req.body:
    {
      password: 'password',
      readonly: false,
      cidr_whitelist: []
    }
    */
    return next({
      token: '12b000',
      cidr_whitelist: [],
      readonly: false,
      key: 'key3',
      created: '2018-08-04T09:04:17.194Z',
    });
  });

  route.delete('/-/npm/v1/tokens/token/:tokenKey', can('publish'), function(req: $RequestExtend, res: $Response, next: $NextFunctionVer) {
    // req.params
    next();
    // return next(ErrorCode.getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, SUPPORT_ERRORS.PLUGIN_MISSING_INTERFACE));
  });
}
