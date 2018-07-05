// @flow

import type {$Response, Router} from 'express';
import type {$RequestExtend, $ResponseExtend, $NextFunctionVer, IAuth} from '../../../../types';
import {ErrorCode} from '../../../lib/utils';

import _ from 'lodash';
import Cookies from 'cookies';

export default function(route: Router, auth: IAuth) {
  route.get('/-/user/:org_couchdb_user', function(req: $RequestExtend, res: $Response, next: $NextFunctionVer) {
    res.status(200);
    next({
      ok: 'you are authenticated as "' + req.remote_user.name + '"',
    });
  });

  route.put('/-/user/:org_couchdb_user/:_rev?/:revision?', function(req: $RequestExtend, res: $Response, next: $NextFunctionVer) {
    let token = (req.body.name && req.body.password)
      ? auth.aesEncrypt(new Buffer(req.body.name + ':' + req.body.password)).toString('base64')
      : undefined;
    if (_.isNil(req.remote_user.name) === false) {
      res.status(201);
      return next({
        ok: 'you are authenticated as \'' + req.remote_user.name + '\'',
        token,
      });
    } else {
      auth.add_user(req.body.name, req.body.password, function(err, user) {
        if (err) {
          if (err.status >= 400 && err.status < 500) {
            // With npm registering is the same as logging in,
            // and npm accepts only an 409 error.
            // So, changing status code here.
            return next( ErrorCode.getCode(err.status, err.message) || ErrorCode.getConflict(err.message));
          }
          return next(err);
        }

        req.remote_user = user;
        res.status(201);
        return next({
          ok: 'user \'' + req.body.name + '\' created',
          token: token,
        });
      });
    }
  });

  route.delete('/-/user/token/*', function(req: $RequestExtend, res: $Response, next: $NextFunctionVer) {
    res.status(200);
    next({
      ok: 'Logged out',
    });
  });


  // placeholder 'cause npm require to be authenticated to publish
  // we do not do any real authentication yet
  route.post('/_session', Cookies.express(), function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    res.cookies.set('AuthSession', String(Math.random()), {
      // npmjs.org sets 10h expire
      expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
    });
    next({
      ok: true,
      name: 'somebody',
      roles: [],
    });
  });
}
