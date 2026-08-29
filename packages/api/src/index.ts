import type { Router } from 'express';
import express from 'express';

import type { Auth } from '@verdaccio/auth';
import {
  WebUrlsNamespace,
  antiLoop,
  encodeScopePackage,
  enforceGeneratedTokenMetadata,
  makeURLrelative,
  match,
  registerBodyParser,
  validateName,
  validatePackage,
} from '@verdaccio/middleware';
import type { Storage } from '@verdaccio/store';
import type { Config, Logger } from '@verdaccio/types';

import { TfaStore } from '@verdaccio/auth';

import distTags from './dist-tags';
import pkg from './package';
import ping from './ping';
import publish from './publish';
import { assertTokenStoreSupport, requireOtp } from './require-otp';
import search from './search';
import stage from './stage';
import user from './user';
import login from './v1/login';
import profile from './v1/profile';
import v1Search from './v1/search';
import token from './v1/token';
import whoami from './whoami';

export default function (config: Config, auth: Auth, storage: Storage, logger: Logger): Router {
  /* eslint new-cap:off */
  const app = express.Router();

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  app.param('package', validatePackage);
  app.param('filename', validateName);
  app.param('tag', validateName);
  app.param('version', validateName);
  app.param('revision', validateName);
  app.param('token', validateName);

  // Express route parameter names must be valid JavaScript identifiers, which means
  // they cannot start with a hyphen (-) or contain special characters like dots (.)
  app.param('_rev', match(/^-rev$/));
  app.param('org_couchdb_user', match(/^org\.couchdb\.user:/));

  // Body parser must be registered before JWT middleware which pauses/resumes the stream
  registerBodyParser(app, config);

  app.use(WebUrlsNamespace.endpoints, (_req, _res, next) => next('router'));

  // Avoid executing JWT twice when the parent app already registered the JWT middleware
  const apiJwtMiddleware = auth.apiJWTmiddleware();
  app.use((req, res, next) => {
    const remoteUser = (req as any).remote_user ?? (res.locals as any).remote_user;
    if (remoteUser) {
      return next();
    }
    return apiJwtMiddleware(req, res, next);
  });

  // built once: without the flag nothing must reach the token store
  let tfaStore: TfaStore | undefined;
  if (config.flags?.tfa) {
    // refuse to start rather than answer 503 on every write later
    assertTokenStoreSupport(storage, logger);
    tfaStore = new TfaStore(storage, config.secret, logger);
  }
  const otpForAuth = requireOtp({ tfaStore, scope: 'auth', logger });
  // at login there is no authenticated user yet: the name is in the body
  const otpForLogin = requireOtp({
    tfaStore,
    scope: 'auth',
    logger,
    getUsername: (req) => (typeof req.body?.name === 'string' ? req.body.name : undefined),
  });
  const otpForWrites = requireOtp({ tfaStore, scope: 'write', logger });

  app.use(enforceGeneratedTokenMetadata(storage, logger));
  app.use(antiLoop(config));
  app.use(makeURLrelative);
  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(encodeScopePackage);
  // for "npm whoami"
  whoami(app);
  profile(app, auth, config, storage, logger);
  search(app, logger);
  user(app, auth, config, logger, otpForLogin);
  distTags(app, auth, storage, logger, otpForWrites);
  publish(app, auth, storage, config, logger, otpForWrites);
  ping(app);
  v1Search(app, auth, storage, config, logger);
  token(app, auth, storage, config, logger, otpForAuth);
  // must stay before pkg(): its '/:package{/:version}' route would otherwise
  // swallow GET /-/stage
  if (config.flags?.stage) {
    stage(app, auth, storage, config, logger, otpForWrites);
  }
  pkg(app, auth, storage, logger);
  if (config.flags?.webLogin) {
    login(app, auth, storage, config, logger);
  }
  return app;
}
