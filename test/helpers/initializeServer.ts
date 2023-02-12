import buildDebug from 'debug';
import express, { Application } from 'express';
import os from 'os';
import path from 'path';

import { errorUtils } from '@verdaccio/core';
import { final } from '@verdaccio/middleware';
import { generateRandomHexString } from '@verdaccio/utils';

import { errorReportingMiddleware, handleError } from '../../src/api/middleware';
import Auth from '../../src/lib/auth';
import Config from '../../src/lib/config';

const debug = buildDebug('verdaccio:tools:helpers:server');

export async function initializeServer(
  configName,
  routesMiddleware: any[] = [],
  Storage
): Promise<Application> {
  const app = express();
  const config = new Config(configName);
  config.storage = path.join(os.tmpdir(), '/storage', generateRandomHexString());
  // httpass would get path.basename() for configPath thus we need to create a dummy folder
  // to avoid conflics
  // FUTURE: self_path is configPath in v6
  config.self_path = config.storage;
  debug('storage: %s', config.storage);
  const storage = new Storage(config);
  await storage.init(config, []);
  const auth: Auth = new Auth(config);
  // FUTURE: in v6 auth.init() is being called
  // TODO: this might not be need it, used in apiEndpoints
  app.use(express.json({ strict: false, limit: '100mb' }));
  // @ts-ignore
  app.use(errorReportingMiddleware);
  for (let route of routesMiddleware) {
    if (route.async) {
      const middleware = await route.routes(config, auth, storage);
      app.use(middleware);
    } else {
      app.use(route(config, auth, storage));
    }
  }

  // catch 404
  app.get('/*', function (req, res, next) {
    next(errorUtils.getNotFound('resource not found'));
  });

  // @ts-ignore
  app.use(handleError);
  // @ts-ignore
  app.use(final);

  app.use(function (request, response) {
    response.status(590);
    response.json({ error: 'cannot handle this' });
  });

  return app;
}
