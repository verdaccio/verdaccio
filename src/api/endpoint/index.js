// @flow

import type {IAuth, IStorageHandler} from '../../../types';
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

const {match, validate_name, validatePackage, encodeScopePackage, anti_loop} = require('../middleware');

export default function(config: Config, auth: IAuth, storage: IStorageHandler) {
  /* eslint new-cap:off */
  const app = express.Router();
  /* eslint new-cap:off */

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  // $FlowFixMe
  app.param('package', validatePackage);
  // $FlowFixMe
  app.param('filename', validate_name);
  app.param('tag', validate_name);
  app.param('version', validate_name);
  app.param('revision', validate_name);
  app.param('token', validate_name);

  // these can't be safely put into express url for some reason
  // TODO: For some reason? what reason?
  app.param('_rev', match(/^-rev$/));
  app.param('org_couchdb_user', match(/^org\.couchdb\.user:/));
  app.param('anything', match(/.*/));

  app.use(auth.apiJWTmiddleware());
  app.use(bodyParser.json({strict: false, limit: config.max_body_size || '10mb'}));
  app.use(anti_loop(config));
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
}
