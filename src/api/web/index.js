import express from 'express';
import _ from 'lodash';
import fs from 'fs';
import Search from '../../lib/search';
import * as Utils from '../../lib/utils';

const Middleware = require('./middleware');
/* eslint new-cap:off */
const router = express.Router();
const env = require('../../config/env');
const template = fs.readFileSync(`${env.DIST_PATH}/index.html`).toString();
const spliceURL = require('../../utils/string').spliceURL;

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

  router.get('/-/verdaccio/logo', function(req, res) {
    const installPath = _.get(config, 'url_prefix', '');

    res.send(_.get(config, 'web.logo') || spliceURL(installPath, '/-/static/logo.png'));
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
