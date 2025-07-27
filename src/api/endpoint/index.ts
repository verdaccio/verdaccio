import express from 'express';

import {
  antiLoop,
  encodeScopePackage,
  match,
  validateName,
  validatePackage,
} from '@verdaccio/middleware';
import { Config } from '@verdaccio/types';

import Auth from '../../lib/auth';
import Storage from '../../lib/storage';
import distTags from './api/dist-tags';
import pkg from './api/package';
import ping from './api/ping';
import publish from './api/publish';
import search from './api/search';
import stars from './api/stars';
import user from './api/user';
import profile from './api/v1/profile';
import v1Search from './api/v1/search';
import token from './api/v1/token';
import whoami from './api/whoami';

export default function (config: Config, auth: Auth, storage: Storage) {
  const app = express.Router();

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  app.param('package', validatePackage);
  app.param('filename', validateName);
  app.param('tag', validateName);
  app.param('version', validateName);
  app.param('revision', validateName);
  app.param('token', validateName);

  // these can't be safely put into express url for some reason
  // TODO: For some reason? what reason?
  app.param('_rev', match(/^-rev$/));
  app.param('org_couchdb_user', match(/^org\.couchdb\.user:/));

  app.use(auth.apiJWTmiddleware());
  app.use(express.json({ strict: false, limit: config.max_body_size || '10mb' }));
  app.use(antiLoop(config));
  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(encodeScopePackage);
  whoami(app);
  profile(app, auth, config);
  search(app, auth, storage);
  user(app, auth, config);
  distTags(app, auth, storage);
  publish(app, auth, storage, config);
  ping(app);
  stars(app, storage);
  v1Search(app, auth, storage);
  token(app, auth, storage, config);
  pkg(app, auth, storage, config);
  return app;
}
