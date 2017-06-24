'use strict';

const async = require('async');
const escape = require('js-string-escape');
const express = require('express');
const fs = require('fs');
const Handlebars = require('handlebars');
const Search = require('../../lib/search');
const Middleware = require('./middleware');
const Utils = require('../../lib/utils');
const securityIframe = Middleware.securityIframe;
/* eslint new-cap:off */
const router = express.Router();
const _ = require('lodash');
const env = require('../../config/env');

module.exports = function(config, auth, storage) {
  Search.configureStorage(storage);

  router.use(auth.jwtMiddleware());
  router.use(securityIframe);

  Handlebars.registerPartial('entry', fs.readFileSync(require.resolve('../../webui/src/entry.hbs'), 'utf8'));

  let template;

  if (config.web && config.web.template) {
    template = Handlebars.compile(fs.readFileSync(config.web.template, 'utf8'));
  } else {
    template = Handlebars.compile(fs.readFileSync(require.resolve('../../webui/src/index.hbs'), 'utf8'));
  }

  // Static
  router.get('/-/static/:filename', function(req, res, next) {
    let file = `${env.APP_ROOT}/static/${req.params.filename}`;
    res.sendFile(file, function(err) {
      if (!err) {
        return;
      }
      if (err.status === 404) {
        next();
      } else {
        next(err);
      }
    });
  });

  router.get('/-/logo', function(req, res, next) {
    res.sendFile(_.get(config, 'web.logo') || `${env.APP_ROOT}/static/logo-sm.png`
    );
  });

  router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    const base = Utils.combineBaseUrl(req.protocol, req.get('host'), config.url_prefix);

    storage.get_local(function(err, packages) {
      if (err) {
        throw err;
      } // that function shouldn't produce any
      async.filterSeries(
        packages,
        function(pkg, cb) {
          auth.allow_access(pkg.name, req.remote_user, function(err, allowed) {
            setImmediate(function() {
              if (err) {
                cb(null, false);
              } else {
                cb(err, allowed);
              }
            });
          });
        },
        function(err, packages) {
          if (err) throw err;

          packages.sort(function(a, b) {
            if (a.name < b.name) {
              return -1;
            } else {
              return 1;
            }
          });
          let json = {
            packages: packages,
            tagline: config.web && config.web.tagline ? config.web.tagline : '',
            baseUrl: base,
            username: req.remote_user.name,
          };
          next(template({
            name: config.web && config.web.title ? config.web.title : 'Verdaccio',
            data: escape(JSON.stringify(json)),
          }));
        }
      );
    });
  });

  return router;
};
