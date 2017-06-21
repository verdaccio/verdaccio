'use strict';

module.exports = function(route) {
  route.get('/whoami', function(req, res, next) {
    if (req.headers.referer === 'whoami') {
      next({username: req.remote_user.name});
    } else {
      next('route');
    }
  });

  route.get('/-/whoami', function(req, res, next) {
    next({username: req.remote_user.name});
  });
};
