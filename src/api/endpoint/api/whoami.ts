import { USER_API_ENDPOINTS } from '@verdaccio/middleware';
import { Response, Router } from 'express';

import { $NextFunctionVer, $RequestExtend } from '../../../types';

export default function (route: Router): void {
  route.get(USER_API_ENDPOINTS.whoami, (req: $RequestExtend, res: Response, next: $NextFunctionVer): any => {
    next({ username: req.remote_user.name });
  });
}
