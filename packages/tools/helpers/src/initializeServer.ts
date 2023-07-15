import buildDebug from 'debug';
import express, { Application } from 'express';
import os from 'os';
import path from 'path';

import { Auth } from '@verdaccio/auth';
import { Config } from '@verdaccio/config';
import { errorUtils } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';
import { errorReportingMiddleware, final, handleError } from '@verdaccio/middleware';
import { generateRandomHexString } from '@verdaccio/utils';

const debug = buildDebug('verdaccio:tools:helpers:server');

export async function initializeServer(
  configName,
  routesMiddleware: any[] = [],
  Storage
): Promise<Application> {
  const app = express();
  const config = new Config(configName, { forceEnhancedLegacySignature: true });
  config.storage = path.join(os.tmpdir(), '/storage', generateRandomHexString());
  // httpass would get path.basename() for configPath thus we need to create a dummy folder
  // to avoid conflics
  config.configPath = config.storage;
  debug('storage: %s', config.storage);
  const storage = new Storage(config);
  await storage.init(config, []);
  const auth: Auth = new Auth(config);
  await auth.init();
  // TODO: this might not be need it, used in apiEndpoints
  app.use(express.json({ strict: false, limit: '10mb' }));
  // @ts-ignore
  app.use(errorReportingMiddleware(logger));
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
  app.use(handleError(logger));
  // @ts-ignore
  app.use(final);

  app.use(function (request, response) {
    response.status(590);
    response.json({ error: 'cannot handle this' });
  });

  return app;
}
