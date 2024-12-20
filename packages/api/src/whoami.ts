import buildDebug from 'debug';
import { Response, Router } from 'express';

import { errorUtils } from '@verdaccio/core';
import { USER_API_ENDPOINTS } from '@verdaccio/middleware';

import { $NextFunctionVer, $RequestExtend } from '../types/custom';

const debug = buildDebug('verdaccio:api:user');

export default function (route: Router): void {
  route.get(
    USER_API_ENDPOINTS.whoami,
    (req: $RequestExtend, _res: Response, next: $NextFunctionVer): any => {
      // remote_user is set by the auth middleware
      const username = req?.remote_user?.name;
      if (!username) {
        debug('whoami: user not found');
        return next(errorUtils.getUnauthorized('Unauthorized'));
      }

      debug('whoami: response %o', username);
      return next({ username: username });
    }
  );
}
