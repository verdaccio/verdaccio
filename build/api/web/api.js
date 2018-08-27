'use strict';

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _user = require('./endpoint/user');

var _user2 = _interopRequireDefault(_user);

var _package = require('./endpoint/package');

var _package2 = _interopRequireDefault(_package);

var _search = require('./endpoint/search');

var _search2 = _interopRequireDefault(_search);

var _search3 = require('../../lib/search');

var _search4 = _interopRequireDefault(_search3);

var _middleware = require('../middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const route = (0, _express.Router)(); /* eslint new-cap: 0 */

/*
 This file include all verdaccio only API(Web UI), for npm API please see ../endpoint/
*/


module.exports = function (config, auth, storage) {
  _search4.default.configureStorage(storage);

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  // $FlowFixMe
  route.param('package', _middleware.validatePackage);
  // $FlowFixMe
  route.param('filename', _middleware.validateName);
  // $FlowFixMe
  route.param('version', _middleware.validateName);
  route.param('anything', (0, _middleware.match)(/.*/));

  route.use(_bodyParser2.default.urlencoded({ extended: false }));
  route.use(auth.webUIJWTmiddleware());
  route.use(_middleware.securityIframe);

  (0, _package2.default)(route, storage, auth);
  (0, _search2.default)(route, storage, auth);
  (0, _user2.default)(route, auth, config);

  // What are you looking for? logout? client side will remove token when user click logout,
  // or it will auto expire after 24 hours.
  // This token is different with the token send to npm client.
  // We will/may replace current token with JWT in next major release, and it will not expire at all(configurable).

  return route;
};