// @flow

import HTTPError from 'http-errors';
import type {Config} from '@verdaccio/types';
import type {Router} from 'express';
import type {IAuth, $ResponseExtend, $RequestExtend, $NextFunctionVer} from '../../../../types';

function addUserAuthApi(route: Router, auth: IAuth, config: Config) {
  route.post('/login', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    auth.authenticate(req.body.username, req.body.password, (err, user) => {
      if (!err) {
        req.remote_user = user;

        next({
          token: auth.issueUIjwt(user, '24h'),
          username: req.remote_user.name,
        });
      } else {
        next(HTTPError[err.message ? 401 : 500](err.message));
      }
    });
  });
}

export default addUserAuthApi;
