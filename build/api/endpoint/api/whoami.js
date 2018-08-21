'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (route) {
  route.get('/whoami', (req, res, next) => {
    if (req.headers.referer === 'whoami') {
      next({ username: req.remote_user.name });
    } else {
      next('route');
    }
  });

  route.get('/-/whoami', (req, res, next) => {
    next({ username: req.remote_user.name });
  });
};