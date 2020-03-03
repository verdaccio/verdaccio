import { Response, Router } from 'express';
import { $RequestExtend, $NextFunctionVer } from '@verdaccio/dev-types';

export default function (route: Router): void {
  route.get('/whoami', (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
    if (req.headers.referer === 'whoami') {
      next({ username: req.remote_user.name });
    } else {
      next('route');
    }
  });

  route.get('/-/whoami', (req: $RequestExtend, res: Response, next: $NextFunctionVer): any => {
    next({ username: req.remote_user.name });
  });
}
