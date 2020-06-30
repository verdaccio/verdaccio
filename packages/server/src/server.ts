import _ from 'lodash';
import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import { HttpError } from 'http-errors';

import { Storage } from '@verdaccio/store';
import { loadPlugin } from '@verdaccio/loaders';
import { Auth } from '@verdaccio/auth';
import apiEndpoint from '@verdaccio/api';
import { ErrorCode } from '@verdaccio/utils';
import { API_ERROR, HTTP_STATUS } from '@verdaccio/dev-commons';
import { Config as AppConfig } from '@verdaccio/config';

import { webAPI, renderWebMiddleware } from '@verdaccio/web';

import { $ResponseExtend, $RequestExtend, $NextFunctionVer, IStorageHandler, IAuth } from '@verdaccio/dev-types';
import { Config as IConfig, IPluginMiddleware, IPluginStorageFilter } from '@verdaccio/types';
import { setup, logger } from '@verdaccio/logger';
import { log, final, errorReportingMiddleware } from '@verdaccio/middleware';

import hookDebug from './debug';

const defineAPI = function(config: IConfig, storage: IStorageHandler): any {
  const auth: IAuth = new Auth(config);
  const app: Application = express();
  // run in production mode by default, just in case
  // it shouldn't make any difference anyway
  app.set('env', process.env.NODE_ENV || 'production');
  app.use(cors());

  // Router setup
  app.use(log(config));
  app.use(errorReportingMiddleware);
  app.use(function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    res.setHeader('X-Powered-By', config.user_agent);
    next();
  });

  app.use(compression());

  app.get('/favicon.ico', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    req.url = '/-/static/favicon.png';
    next();
  });

  // Hook for tests only
  if (config._debug) {
    hookDebug(app, config.self_path);
  }

  // register middleware plugins
  const plugin_params = {
    config: config,
    logger: logger,
  };

  const plugins: IPluginMiddleware<IConfig>[] = loadPlugin(config, config.middlewares, plugin_params, function(plugin: IPluginMiddleware<IConfig>) {
    return plugin.register_middlewares;
  });
  plugins.forEach((plugin: IPluginMiddleware<IConfig>) => {
    plugin.register_middlewares(app, auth, storage);
  });

  // For  npm request
  app.use(apiEndpoint(config, auth, storage));

  // For WebUI & WebUI API
  if (_.get(config, 'web.enable', true)) {
    app.use('/', renderWebMiddleware(config, auth, storage));
    app.use('/-/verdaccio/', webAPI(config, auth, storage));
  } else {
    app.get('/', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      next(ErrorCode.getNotFound(API_ERROR.WEB_DISABLED));
    });
  }

  // Catch 404
  app.get('/*', function(req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    next(ErrorCode.getNotFound(API_ERROR.FILE_NOT_FOUND));
  });

  app.use(function(err: HttpError, req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    if (_.isError(err)) {
      if (err.code === 'ECONNABORT' && res.statusCode === HTTP_STATUS.NOT_MODIFIED) {
        return next();
      }
      if (_.isFunction(res.locals.report_error) === false) {
        // in case of very early error this middleware may not be loaded before error is generated
        // fixing that
        errorReportingMiddleware(req, res, _.noop);
      }
      res.locals.report_error(err);
    } else {
      // Fall to Middleware.final
      return next(err);
    }
  });

  app.use(final);

  return app;
};

export default (async function(configHash: any): Promise<any> {
  setup(configHash.logs);
  const config: IConfig = new AppConfig(_.cloneDeep(configHash));
  // register middleware plugins
  const plugin_params = {
    config: config,
    logger: logger,
  };
  const filters = loadPlugin(config, config.filters || {}, plugin_params, (plugin: IPluginStorageFilter<IConfig>) => plugin.filter_metadata);
  const storage: IStorageHandler = new Storage(config);
  // waits until init calls have been initialized
  await storage.init(config, filters);
  return defineAPI(config, storage);
});
