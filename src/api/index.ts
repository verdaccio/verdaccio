import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import _ from 'lodash';

import { Auth } from '@verdaccio/auth';
import { getUserAgent } from '@verdaccio/config';
import { PLUGIN_CATEGORY, pluginUtils } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import { errorReportingMiddleware, final, handleError } from '@verdaccio/middleware';
import { log } from '@verdaccio/middleware';
import { SearchMemoryIndexer } from '@verdaccio/search-indexer';
import { ConfigYaml, Config as IConfig } from '@verdaccio/types';

import AppConfig from '../lib/config';
import { API_ERROR } from '../lib/constants';
import { logger } from '../lib/logger';
import Storage from '../lib/storage';
import { ErrorCode } from '../lib/utils';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types';
import hookDebug from './debug';
import apiEndpoint from './endpoint';
import { serveFavicon } from './middleware';
import webMiddleware from './web';

const version = process.env.PACKAGE_VERSION || 'dev';

const defineAPI = async function (config: IConfig, storage: Storage): Promise<express.Application> {
  const auth = new Auth(config, logger, { legacyMergeConfigs: true });
  await auth.init();
  const app: Application = express();
  SearchMemoryIndexer.configureStorage(storage);
  await SearchMemoryIndexer.init(logger);
  // run in production mode by default, just in case
  // it shouldn't make any difference anyway
  app.set('env', process.env.NODE_ENV || 'production');

  // Allow `req.ip` to resolve properly when Verdaccio is behind a proxy or load-balancer
  // See: https://expressjs.com/en/guide/behind-proxies.html
  if (config.server?.trustProxy) {
    app.set('trust proxy', config.server.trustProxy);
  }

  app.use(cors());

  // // Router setup
  app.use(log(logger));
  app.use(errorReportingMiddleware(logger));
  if (config.user_agent) {
    app.use(function (_req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      res.setHeader('X-Powered-By', getUserAgent(config.user_agent));
      next();
    });
  } else {
    app.disable('x-powered-by');
  }

  app.use(compression());

  app.get('/-/static/favicon.ico', serveFavicon(config));

  // Hook for tests only
  if (config._debug) {
    hookDebug(app, config.configPath);
  }

  const plugins: pluginUtils.ExpressMiddleware<IConfig, '', Auth>[] = await asyncLoadPlugin(
    config.middlewares,
    {
      config,
      logger,
    },
    function (plugin) {
      return typeof plugin.register_middlewares !== 'undefined';
    },
    true,
    config?.serverSettings?.pluginPrefix ?? 'verdaccio',
    PLUGIN_CATEGORY.MIDDLEWARE
  );

  plugins.forEach((plugin: any) => {
    plugin.register_middlewares(app, auth, storage);
  });

  // // For  npm request
  app.use(apiEndpoint(config, auth, storage));

  // For WebUI & WebUI API
  if (_.get(config, 'web.enable', true)) {
    app.use((_req, res, next) => {
      res.locals.app_version = version ?? '';
      next();
    });
    const middleware = await webMiddleware(config, auth, storage, logger);
    app.use(middleware);
  } else {
    app.get('/', function (_, __, next: $NextFunctionVer) {
      next(ErrorCode.getNotFound(API_ERROR.WEB_DISABLED));
    });
  }

  app.get('/*', function (_, __, next: $NextFunctionVer) {
    next(ErrorCode.getNotFound(API_ERROR.FILE_NOT_FOUND));
  });
  app.use(handleError(logger));
  app.use(final);

  return app;
};

export default (async function (configHash: ConfigYaml): Promise<express.Application> {
  const config: IConfig = new AppConfig(_.cloneDeep(configHash));

  const storage = new Storage(config);
  // waits until init calls have been initialized
  await storage.init(config);
  return await defineAPI(config, storage);
});
