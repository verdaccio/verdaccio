'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (route) {
  route.get('/-/ping', function (req, res, next) {
    next({});
  });
};