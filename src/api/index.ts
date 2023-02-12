import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import _ from 'lodash';

import { getUserAgent } from '@verdaccio/config';
import { final } from '@verdaccio/middleware';
import { log } from '@verdaccio/middleware';
import { Config as IConfig, IPluginMiddleware, IPluginStorageFilter } from '@verdaccio/types';

import Auth from '../lib/auth';
import AppConfig from '../lib/config';
import { API_ERROR } from '../lib/constants';
import { logger, setup } from '../lib/logger';
import loadPlugin from '../lib/plugin-loader';
import Storage from '../lib/storage';
import { ErrorCode } from '../lib/utils';
import {
  $NextFunctionVer,
  $RequestExtend,
  $ResponseExtend,
  IAuth,
  IStorageHandler,
} from '../types';
import hookDebug from './debug';
import apiEndpoint from './endpoint';
import { errorReportingMiddleware, handleError, serveFavicon } from './middleware';
import webMiddleware from './web';

export function loadTheme(config) {
  if (_.isNil(config.theme) === false) {
    return _.head(
      loadPlugin(
        config,
        config.theme,
        {},
        function (plugin) {
          return plugin.staticPath && plugin.manifest && plugin.manifestFiles;
        },
        'verdaccio-theme'
      )
    );
  }
}

const defineAPI = function (config: IConfig, storage: IStorageHandler): any {
  const auth: IAuth = new Auth(config);
  const app: Application = express();

  // run in production mode by default, just in case
  // it shouldn't make any difference anyway
  app.set('env', process.env.NODE_ENV || 'production');

  // Allow `req.ip` to resolve properly when Verdaccio is behind a proxy or load-balancer
  // See: https://expressjs.com/en/guide/behind-proxies.html
  if (config.server?.trustProxy) {
    app.set('trust proxy', config.server.trustProxy);
  }

  app.use(cors());

  // Router setup
  app.use(log(logger));
  app.use(errorReportingMiddleware);
  if (config.user_agent) {
    app.use(function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
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
    hookDebug(app, config.self_path);
  }

  // register middleware plugins
  const plugin_params = {
    config: config,
    logger: logger,
  };

  const plugins: IPluginMiddleware<IConfig>[] = loadPlugin(
    config,
    config.middlewares,
    plugin_params,
    function (plugin: IPluginMiddleware<IConfig>) {
      return plugin.register_middlewares;
    }
  );
  plugins.forEach((plugin: IPluginMiddleware<IConfig>) => {
    plugin.register_middlewares(app, auth, storage);
  });

  // For  npm request
  app.use(apiEndpoint(config, auth, storage));

  // For WebUI & WebUI API
  if (_.get(config, 'web.enable', true)) {
    app.use('/', webMiddleware(config, auth, storage));
  } else {
    app.get('/', function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      next(ErrorCode.getNotFound(API_ERROR.WEB_DISABLED));
    });
  }

  // Catch 404
  app.get('/*', function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    next(ErrorCode.getNotFound(API_ERROR.FILE_NOT_FOUND));
  });
  app.use(handleError);
  app.use(final);

  return app;
};

export default (async function (configHash: any): Promise<any> {
  setup(configHash.logs);
  const config: IConfig = new AppConfig(_.cloneDeep(configHash));
  // register middleware plugins
  const plugin_params = {
    config: config,
    logger: logger,
  };
  const filters = loadPlugin(
    config,
    config.filters || {},
    plugin_params,
    (plugin: IPluginStorageFilter<IConfig>) => plugin.filter_metadata
  );
  const storage: IStorageHandler = new Storage(config);
  // waits until init calls have been initialized
  await storage.init(config, filters);
  return defineAPI(config, storage);
});
