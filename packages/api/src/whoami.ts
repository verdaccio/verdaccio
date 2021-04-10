import { Response, Router } from 'express';
import buildDebug from 'debug';
import { $RequestExtend, $NextFunctionVer } from '../types/custom';
// import { getUnauthorized } from '@verdaccio/commons-api';

const debug = buildDebug('verdaccio:api:user');

export default function (route: Router): void {
  route.get('/whoami', (req: $RequestExtend, res: Response, next: $NextFunctionVer): void => {
    debug('whoami: reditect');
    if (req.headers.referer === 'whoami') {
      const username = req.remote_user.name;
      // FIXME: this service should return 401 if user missing
      // if (!username) {
      //   debug('whoami: user not found');
      //   return next(getUnauthorized('Unauthorized'));
      // }
      debug('whoami: logged by user');
      return next({ username: username });
    } else {
      debug('whoami: redirect next route');
      // redirect to the route below
      return next('route');
    }
  });

  route.get('/-/whoami', (req: $RequestExtend, res: Response, next: $NextFunctionVer): any => {
    const username = req.remote_user.name;
    // FIXME: this service should return 401 if user missing
    // if (!username) {
    //   debug('whoami: user not found');
    //   return next(getUnauthorized('Unauthorized'));
    // }

    debug('whoami: response %o', username);
    return next({ username: username });
  });
}
