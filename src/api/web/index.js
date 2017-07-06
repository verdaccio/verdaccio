'use strict';

const express = require('express');
const Search = require('../../lib/search');
const Middleware = require('./middleware');
const Utils = require('../../lib/utils');
/* eslint new-cap:off */
const router = express.Router();
const _ = require('lodash');
const env = require('../../config/env');
const fs = require('fs');
const template = fs.readFileSync(`${env.DIST_PATH}/index.html`).toString();

module.exports = function(config, auth, storage) {
  Search.configureStorage(storage);

  router.use(auth.jwtMiddleware());
  router.use(Middleware.securityIframe);

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
    res.send(template.replace(/ToReplaceByVerdaccio/g, base));
  });

  return router;
};
