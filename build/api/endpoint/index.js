'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config, auth, storage) {
  /* eslint new-cap:off */
  const app = _express2.default.Router();
  /* eslint new-cap:off */

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  // $FlowFixMe
  app.param('package', validatePackage);
  // $FlowFixMe
  app.param('filename', validateName);
  app.param('tag', validateName);
  app.param('version', validateName);
  app.param('revision', validateName);
  app.param('token', validateName);

  // these can't be safely put into express url for some reason
  // TODO: For some reason? what reason?
  app.param('_rev', match(/^-rev$/));
  app.param('org_couchdb_user', match(/^org\.couchdb\.user:/));
  app.param('anything', match(/.*/));

  app.use(auth.apiJWTmiddleware());
  app.use(_bodyParser2.default.json({ strict: false, limit: config.max_body_size || '10mb' }));
  app.use(anti_loop(config));
  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(encodeScopePackage);
  // for "npm whoami"
  (0, _whoami2.default)(app);
  (0, _package2.default)(app, auth, storage, config);
  (0, _search2.default)(app, auth, storage);
  (0, _user2.default)(app, auth);
  (0, _distTags2.default)(app, auth, storage);
  (0, _publish2.default)(app, auth, storage, config);
  (0, _ping2.default)(app);

  return app;
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _whoami = require('./api/whoami');

var _whoami2 = _interopRequireDefault(_whoami);

var _ping = require('./api/ping');

var _ping2 = _interopRequireDefault(_ping);

var _user = require('./api/user');

var _user2 = _interopRequireDefault(_user);

var _distTags = require('./api/dist-tags');

var _distTags2 = _interopRequireDefault(_distTags);

var _publish = require('./api/publish');

var _publish2 = _interopRequireDefault(_publish);

var _search = require('./api/search');

var _search2 = _interopRequireDefault(_search);

var _package = require('./api/package');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { match, validateName, validatePackage, encodeScopePackage, anti_loop } = require('../middleware');