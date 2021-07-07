import _ from 'lodash';
import express, { Application } from 'express';
import buildDebug from 'debug';
import compression from 'compression';
import cors from 'cors';
import RateLimit from 'express-rate-limit';
import { HttpError } from 'http-errors';

import { loadPlugin } from '@verdaccio/loaders';
import { Auth } from '@verdaccio/auth';
import apiEndpoint from '@verdaccio/api';
import { ErrorCode } from '@verdaccio/utils';
import { API_ERROR, HTTP_STATUS } from '@verdaccio/commons-api';
import { Config as AppConfig } from '@verdaccio/config';

import webMiddleware from '@verdaccio/web';
import { ConfigRuntime } from '@verdaccio/types';

import { IAuth, IBasicAuth } from '@verdaccio/auth';
import { Storage } from '@verdaccio/store';
import { logger } from '@verdaccio/logger';
import { log, final, errorReportingMiddleware } from '@verdaccio/middleware';
import AuditMiddleware from 'verdaccio-audit';

import { Config as IConfig, IPluginStorageFilter, IPlugin } from '@verdaccio/types';
import { $ResponseExtend, $RequestExtend, $NextFunctionVer } from '../types/custom';

import hookDebug from './debug';

export interface IPluginMiddleware<T> extends IPlugin<T> {
  register_middlewares(app: any, auth: IBasicAuth<T>, storage: Storage): void;
}

const debug = buildDebug('verdaccio:server');

const defineAPI = function (config: IConfig, storage: Storage): any {
  const auth: IAuth = new Auth(config);
  const app: Application = express();
  const limiter = new RateLimit(config.serverSettings.rateLimit);
  // run in production mode by default, just in case
  // it shouldn't make any difference anyway
  app.set('env', process.env.NODE_ENV || 'production');
  app.use(cors());
  app.use(limiter);

  // Router setup
  app.use(log);
  app.use(errorReportingMiddleware);
  app.use(function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
    res.setHeader('X-Powered-By', config.user_agent);
    next();
  });

  app.use(compression());

  app.get(
    '/favicon.ico',
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      req.url = '/-/static/favicon.png';
      next();
    }
  );

  // Hook for tests only
  if (config._debug) {
    hookDebug(app, config.config_path);
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

  if (_.isEmpty(plugins)) {
    plugins.push(
      new AuditMiddleware(
        { ...config, enabled: true, strict_ssl: true },
        { config, logger: logger }
      )
    );
  }

  plugins.forEach((plugin: IPluginMiddleware<IConfig>) => {
    plugin.register_middlewares(app, auth, storage);
  });

  // For  npm request
  // @ts-ignore
  app.use(apiEndpoint(config, auth, storage));

  // For WebUI & WebUI API
  if (_.get(config, 'web.enable', true)) {
    app.use(webMiddleware(config, auth, storage));
  } else {
    app.get('/', function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      next(ErrorCode.getNotFound(API_ERROR.WEB_DISABLED));
    });
  }

  // Catch 404
  app.get('/*', function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    next(ErrorCode.getNotFound(API_ERROR.FILE_NOT_FOUND));
  });

  app.use(function (
    err: HttpError,
    req: $RequestExtend,
    res: $ResponseExtend,
    next: $NextFunctionVer
  ) {
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

export default (async function (configHash: ConfigRuntime): Promise<any> {
  debug('start server');
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
  debug('loaded filter plugin');
  // @ts-ignore
  const storage: Storage = new Storage(config);
  try {
    // waits until init calls have been initialized
    debug('storage init start');
    await storage.init(config, filters);
    debug('storage init end');
  } catch (err: any) {
    logger.error({ error: err.msg }, 'storage has failed: @{error}');
    throw new Error(err);
  }
  return defineAPI(config, storage);
});
