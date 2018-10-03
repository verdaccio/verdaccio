/**
 * @prettier
 * @flow
 */

import type { $Response, Router } from 'express';
import type { $RequestExtend, $NextFunctionVer } from '../../../../types';

export default function(route: Router) {
  route.get(
    '/whoami',
    (req: $RequestExtend, res: $Response, next: $NextFunctionVer): void => {
      if (req.headers.referer === 'whoami') {
        next({ username: req.remote_user.name });
      } else {
        next('route');
      }
    }
  );

  route.get(
    '/-/whoami',
    (req: $RequestExtend, res: $Response, next: $NextFunctionVer): mixed => {
      next({ username: req.remote_user.name });
    }
  );
}
