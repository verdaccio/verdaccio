import bodyParser from 'body-parser';
import express, { Router } from 'express';

import { IAuth } from '@verdaccio/auth';
import {
  antiLoop,
  encodeScopePackage,
  match,
  validateName,
  validatePackage,
} from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Config } from '@verdaccio/types';

import distTags from './dist-tags';
import pkg from './package';
import ping from './ping';
import publish from './publish';
import search from './search';
import stars from './stars';
import user from './user';
import profile from './v1/profile';
import v1Search from './v1/search';
import token from './v1/token';
import whoami from './whoami';

export default function (config: Config, auth: IAuth, storage: Storage): Router {
  /* eslint new-cap:off */
  const app = express.Router();
  /* eslint new-cap:off */

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
  app.param('anything', match(/.*/));
  app.use(auth.apiJWTmiddleware());
  app.use(bodyParser.json({ strict: false, limit: config.max_body_size || '10mb' }));
  // @ts-ignore
  app.use(antiLoop(config));
  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(encodeScopePackage);
  // for "npm whoami"
  whoami(app);
  pkg(app, auth, storage);
  profile(app, auth);
  // @deprecated endpoint, 404 by default
  search(app);
  user(app, auth, config);
  distTags(app, auth, storage);
  publish(app, auth, storage);
  ping(app);
  stars(app, storage);
  // @ts-ignore
  v1Search(app, auth, storage);
  token(app, auth, storage, config);
  return app;
}
