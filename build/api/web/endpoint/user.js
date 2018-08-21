'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addUserAuthApi(route, auth, config) {
  route.post('/login', function (req, res, next) {
    auth.authenticate(req.body.username, req.body.password, (err, user) => {
      if (!err) {
        req.remote_user = user;

        next({
          token: auth.issueUIjwt(user, '24h'),
          username: req.remote_user.name
        });
      } else {
        next(_httpErrors2.default[err.message ? 401 : 500](err.message));
      }
    });
  });
}

exports.default = addUserAuthApi;