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
    const file = `${env.APP_ROOT}/static/${req.params.filename}`;
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

  router.get('/-/logo', function(req, res) {
    res.sendFile(_.get(config, 'web.logo') || `${env.APP_ROOT}/static/logo-sm.png`
    );
  });

  router.get('/', function(req, res) {
    const base = Utils.combineBaseUrl(Utils.getWebProtocol(req), req.get('host'), config.url_prefix);
    const defaultTitle = 'Verdaccio';
    let webPage = template
      .replace(/ToReplaceByVerdaccio/g, base)
      .replace(/ToReplaceByTitle/g, _.get(config, 'web.title') ? config.web.title : defaultTitle)
      .replace(/(main.*\.js|style.*\.css)/g, `${base}/-/static/$1`);

    res.setHeader('Content-Type', 'text/html');

    res.send(webPage);
  });

  return router;
};
