'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Middleware = require('../middleware');
const match = Middleware.match;
const validate_name = Middleware.validate_name;
const validate_pkg = Middleware.validate_package;
const encodeScopePackage = Middleware.encodeScopePackage;

const whoami = require('./endpoint/whoami');
const ping = require('./endpoint/ping');
const user = require('./endpoint/user');
const distTags = require('./endpoint/dist-tags');
const publish = require('./endpoint/publish');
const search = require('./endpoint/search');
const pkg = require('./endpoint/package');

module.exports = function(config, auth, storage) {
  /* eslint new-cap:off */
  const app = express.Router();
  /* eslint new-cap:off */

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  app.param('package', validate_pkg);
  app.param('filename', validate_name);
  app.param('tag', validate_name);
  app.param('version', validate_name);
  app.param('revision', validate_name);
  app.param('token', validate_name);

  // these can't be safely put into express url for some reason
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
