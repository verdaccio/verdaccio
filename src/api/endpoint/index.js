/**
 * @prettier
 * @flow
 */

import type { IAuth, IStorageHandler } from '../../../types';
import type { Config } from '@verdaccio/types';

import express from 'express';
import bodyParser from 'body-parser';
import whoami from './api/whoami';
import ping from './api/ping';
import user from './api/user';
import distTags from './api/dist-tags';
import publish from './api/publish';
import search from './api/search';
import pkg from './api/package';
import profile from './api/v1/profile';

const { match, validateName, validatePackage, encodeScopePackage, antiLoop } = require('../middleware');

export default function(config: Config, auth: IAuth, storage: IStorageHandler) {
  /* eslint new-cap:off */
  const app = express.Router();
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
  app.use(bodyParser.json({ strict: false, limit: config.max_body_size || '10mb' }));
  app.use(antiLoop(config));
  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(encodeScopePackage);
  // for "npm whoami"
  whoami(app);
  pkg(app, auth, storage, config);
  profile(app, auth);
  search(app, auth, storage);
  user(app, auth, config);
  distTags(app, auth, storage);
  publish(app, auth, storage, config);
  ping(app);

  return app;
}
