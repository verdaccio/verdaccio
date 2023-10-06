import compression from 'compression';
import cors from 'cors';
import buildDebug from 'debug';
import express from 'express';
import { HttpError } from 'http-errors';
import _ from 'lodash';
import AuditMiddleware from 'verdaccio-audit';

import apiEndpoint from '@verdaccio/api';
import { Auth } from '@verdaccio/auth';
import { Config as AppConfig } from '@verdaccio/config';
import { API_ERROR, HTTP_STATUS, errorUtils, pluginUtils } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import { logger } from '@verdaccio/logger';
import { errorReportingMiddleware, final, log, rateLimit, userAgent } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { ConfigYaml } from '@verdaccio/types';
import { Config as IConfig } from '@verdaccio/types';
import webMiddleware from '@verdaccio/web';

import { $NextFunctionVer, $RequestExtend, $ResponseExtend } from '../types/custom';
import hookDebug from './debug';

const debug = buildDebug('verdaccio:server');
const { version } = require('../package.json');

const defineAPI = async function (config: IConfig, storage: Storage): Promise<any> {
  const auth: Auth = new Auth(config);
  await auth.init();
  const app = express();
  // run in production mode by default, just in case
  // it shouldn't make any difference anyway
  app.set('env', process.env.NODE_ENV || 'production');
  if (config.server?.trustProxy) {
    app.set('trust proxy', config.server.trustProxy);
  }
  app.use(cors());
  app.use(rateLimit(config.serverSettings.rateLimit));

  const errorReportingMiddlewareWrap = errorReportingMiddleware(logger);

  // Router setup
  app.use(log(logger));
  app.use(errorReportingMiddlewareWrap);
  app.use(userAgent(config));
  app.use(compression());

  app.get(
    '/favicon.ico',
    function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer): void {
      req.url = '/-/static/favicon.ico';
      next();
    }
  );

  // Hook for tests only
  if (config._debug) {
    hookDebug(app, config.configPath);
  }

  const plugins: pluginUtils.ExpressMiddleware<IConfig, {}, Auth>[] = await asyncLoadPlugin(
    config.middlewares,
    {
      config,
      logger,
    },
    function (plugin) {
      return typeof plugin.register_middlewares !== 'undefined';
    }
  );

  if (plugins.length === 0) {
    logger.info('none middleware plugins has been defined, adding audit middleware by default');
    // @ts-ignore
    plugins.push(new AuditMiddleware({ enabled: true, strict_ssl: true }, { config, logger }));
  }

  plugins.forEach((plugin: pluginUtils.ExpressMiddleware<IConfig, {}, Auth>) => {
    plugin.register_middlewares(app, auth, storage);
  });

  // For  npm request
  // @ts-ignore
  app.use(apiEndpoint(config, auth, storage));

  // For WebUI & WebUI API
  if (_.get(config, 'web.enable', true)) {
    app.use((_req, res, next) => {
      res.locals.app_version = version ?? '';
      next();
    });
    const middleware = await webMiddleware(config, auth, storage);
    app.use(middleware);
  } else {
    app.get('/', function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
      next(errorUtils.getNotFound(API_ERROR.WEB_DISABLED));
    });
  }

  // Catch 404
  app.get('/*', function (req: $RequestExtend, res: $ResponseExtend, next: $NextFunctionVer) {
    next(errorUtils.getNotFound('resource not found'));
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
        errorReportingMiddlewareWrap(req, res, _.noop);
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

export default (async function startServer(configHash: ConfigYaml): Promise<any> {
  debug('start server');
  const config: IConfig = new AppConfig({ ...configHash } as any);
  // register middleware plugins
  debug('loaded filter plugin');
  // @ts-ignore
  const storage: Storage = new Storage(config);
  try {
    // waits until init calls have been initialized
    debug('storage init start');
    await storage.init(config);
    debug('storage init end');
  } catch (err: any) {
    logger.error({ error: err.msg }, 'storage has failed: @{error}');
    throw new Error(err);
  }
  return await defineAPI(config, storage);
});
