const express = require('express');
const bodyParser = require('body-parser');
const Middleware = require('../web/middleware');
const match = Middleware.match;
const validateName = Middleware.validate_name;
const validatePkg = Middleware.validate_package;
const encodeScopePackage = Middleware.encodeScopePackage;

const whoami = require('./api/whoami');
const ping = require('./api/ping');
const user = require('./api/user');
const distTags = require('./api/dist-tags');
const publish = require('./api/publish');
const search = require('./api/search');
const pkg = require('./api/package');

module.exports = function(config, auth, storage) {
  /* eslint new-cap:off */
  const app = express.Router();
  /* eslint new-cap:off */

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  app.param('package', validatePkg);
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

  app.use(auth.basic_middleware());
  // app.use(auth.bearer_middleware())
  app.use(bodyParser.json({strict: false, limit: config.max_body_size || '10mb'}));
  app.use(Middleware.anti_loop(config));

  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(encodeScopePackage);

  // for "npm whoami"
  whoami(app);

  pkg(app, auth, storage, config);

  search(app, auth, storage);

  user(app, auth);

  distTags(app, auth, storage);

  publish(app, auth, storage, config);

  ping(app);

  return app;
};
