'use strict';

module.exports = function(route) {
  route.get('/-/ping', function(req, res, next) {
    next({});
  });
};
