'use strict';

const express = require('express');
const Error = require('http-errors');
const compression = require('compression');
const Config = require('../lib/config');
const Middleware = require('./web/middleware');
const Cats = require('../lib/status-cats');
const Storage = require('../lib/storage');
const _ = require('lodash');
const cors = require('cors');

module.exports = function(config_hash) {
  // Config
  const logger = require('../lib/logger')(config_hash.logger, true);
  // auth.js and plugin-loader.js must be required after the logger has
  // been re-initialized with the desired configuration.
  const Auth = require('../lib/auth');
  const load_plugins = require('../lib/plugin-loader').load_plugins;
  const config = new Config(config_hash);
  const storage = new Storage(config);
  const auth = new Auth(config);
  const app = express();
  // run in production mode by default, just in case
  // it shouldn't make any difference anyway
  app.set('env', process.env.NODE_ENV || 'production');
  // Setup logging within Express itself as the first Express middleware.
  app.use(require('express-pino-logger')({logger: logger}));
  app.use(cors());

  // Middleware
  const error_reporting_middleware = function(req, res, next) {
    res.report_error = res.report_error || function(err) {
      if (err.status && err.status >= 400 && err.status < 600) {
        if (_.isNil(res.headersSent) === false) {
          res.status(err.status);
          next({error: err.message || 'unknown error'});
        }
      } else {
        req.log.error('unexpected error: %s', err.message);
        req.log.debug(err.stack);
        if (!res.status || !res.send) {
          req.log.error('this is an error in express.js, please report this');
          res.destroy();
        } else if (!res.headersSent) {
          res.status(500);
          next({error: 'internal server error'});
        } else {
          // socket should be already closed
        }
      }
    };
    next();
  };

  // Router setup
  app.use(error_reporting_middleware);
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
    app.get('/-/_debug', function(req, res, next) {
      const do_gc = _.isNil(global.gc) === false;
      if (do_gc) {
        global.gc();
      }
      next({
        pid: process.pid,
        main: process.mainModule.filename,
        conf: config.self_path,
        mem: process.memoryUsage(),
        gc: do_gc,
      });
    });
  }
  // register middleware plugins
  const plugin_params = {
    config: config,
    logger: logger,
  };
  const plugins = load_plugins(config, config.middlewares, plugin_params, function(plugin) {
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
        error_reporting_middleware(req, res, _.noop);
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

