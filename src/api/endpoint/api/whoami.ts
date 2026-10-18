import type { Response, Router } from 'express';

import { errorUtils } from '@verdaccio/core';
import { USER_API_ENDPOINTS } from '@verdaccio/middleware';

import type { $NextFunctionVer, $RequestExtend } from '../../../types';

export default function (route: Router): void {
  route.get(
    USER_API_ENDPOINTS.whoami,
    (req: $RequestExtend, res: Response, next: $NextFunctionVer): any => {
      const username = req.remote_user?.name;
      if (!username) {
        return next(errorUtils.getUnauthorized('Unauthorized'));
      }

      next({ username });
    }
  );
}
