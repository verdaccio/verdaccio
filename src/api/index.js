import express from 'express';
import Error from 'http-errors';
import compression from 'compression';
import _ from 'lodash';
import cors from 'cors';
import Storage from '../lib/storage';
import {loadPlugin} from '../lib/plugin-loader';
import hookDebug from './debug';
import Auth from '../lib/auth';

const Logger = require('../lib/logger');
const Config = require('../lib/config');
const Middleware = require('./web/middleware');
const Cats = require('../lib/status-cats');

module.exports = function(configHash) {
  // Config
  Logger.setup(configHash.logs);
  const config = new Config(configHash);
  const storage = new Storage(config);
  const auth = new Auth(config);
  const app = express();
  // run in production mode by default, just in case
  // it shouldn't make any difference anyway
  app.set('env', process.env.NODE_ENV || 'production');
  app.use(cors());

  // Router setup
  app.use(Middleware.log);
  app.use(Middleware.errorReportingMiddleware);
  app.use(function(req, res, next) {
    res.setHeader('X-Powered-By', config.user_agent);
    next();
  });
  app.use(Cats.middleware);
  app.use(compression());

  app.get('/favicon.ico', function(req, res, next) {
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
    logger: Logger.logger,
  };
  const plugins = loadPlugin(config, config.middlewares, plugin_params, function(plugin) {
    return plugin.register_middlewares;
  });
  plugins.forEach(function(plugin) {
    plugin.register_middlewares(app, auth, storage);
  });

  // For  npm request
  app.use(require('./endpoint')(config, auth, storage));

  // For WebUI & WebUI API
  if (_.get(config, 'web.enable', true)) {
    app.use('/', require('./web')(config, auth, storage));
    app.use('/-/verdaccio/', require('./web/api')(config, auth, storage));
  } else {
    app.get('/', function(req, res, next) {
      next(Error[404]('Web interface is disabled in the config file'));
    });
  }

  // Catch 404
  app.get('/*', function(req, res, next) {
    next(Error[404]('File not found'));
  });

  app.use(function(err, req, res, next) {
    if (_.isError(err)) {
      if (err.code === 'ECONNABORT' && res.statusCode === 304) {
        return next();
      }
      if (_.isFunction(res.report_error) === false) {
        // in case of very early error this middleware may not be loaded before error is generated
        // fixing that
        Middleware.errorReportingMiddleware(req, res, _.noop);
      }
      res.report_error(err);
    } else {
      // Fall to Middleware.final
      return next(err);
    }
  });

  app.use(Middleware.final);

  return app;
};

