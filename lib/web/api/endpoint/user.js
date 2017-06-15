'use strict';

const _ = require('lodash');
const Cookies = require('cookies');
const createError = require('http-errors');

module.exports = function(route, auth) {
  route.get('/-/user/:org_couchdb_user', function(req, res, next) {
    res.status(200);
    next({
      ok: 'you are authenticated as "' + req.remote_user.name + '"',
    });
  });

  route.put('/-/user/:org_couchdb_user/:_rev?/:revision?', function(req, res, next) {
    let token = (req.body.name && req.body.password)
      ? auth.aes_encrypt(req.body.name + ':' + req.body.password).toString('base64')
      : undefined;
    if (_.isNil(req.remote_user.name) === false) {
      res.status(201);
      return next({
        ok: 'you are authenticated as \'' + req.remote_user.name + '\'',
        // token: auth.issue_token(req.remote_user),
        token: token,
      });
    } else {
      auth.add_user(req.body.name, req.body.password, function(err, user) {
        if (err) {
          if (err.status >= 400 && err.status < 500) {
            // With npm registering is the same as logging in,
            // and npm accepts only an 409 error.
            // So, changing status code here.
            return next( createError[409](err.message) );
          }
          return next(err);
        }

        req.remote_user = user;
        res.status(201);
        return next({
          ok: 'user \'' + req.body.name + '\' created',
          // token: auth.issue_token(req.remote_user),
          token: token,
        });
      });
    }
  });

  route.delete('/-/user/token/*', function(req, res, next) {
    res.status(200);
    next({
      ok: 'Logged out',
    });
  });


  // placeholder 'cause npm require to be authenticated to publish
  // we do not do any real authentication yet
  route.post('/_session', Cookies.express(), function(req, res, next) {
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
};
