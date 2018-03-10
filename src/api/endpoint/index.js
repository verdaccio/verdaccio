// @flow

import type {IAuth, IStorage} from '../../../types';
import type {Config} from '@verdaccio/types';

import express from 'express';
import bodyParser from 'body-parser';
import whoami from './api/whoami';
import ping from './api/ping';
import user from './api/user';
import distTags from './api/dist-tags';
import publish from './api/publish';
import search from './api/search';
import pkg from './api/package';

const Middleware = require('../web/middleware');
const match = Middleware.match;
const validateName = Middleware.validate_name;
const validatePkg = Middleware.validate_package;
const encodeScopePackage = Middleware.encodeScopePackage;

module.exports = function(config: Config, auth: IAuth, storage: IStorage) {
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
