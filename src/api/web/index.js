/**
 * @prettier
 */

import _ from 'lodash';
import fs from 'fs';
import VError from 'verror';
import chalk from 'chalk';
import path from 'path';
import express from 'express';

import { combineBaseUrl, getWebProtocol } from '../../lib/utils';
import Search from '../../lib/search';
import { HEADERS, HTTP_STATUS, WEB_TITLE } from '../../lib/constants';

const { securityIframe } = require('../middleware');
const distLocation = require('@verdaccio/ui-theme')();
const indexTemplate = path.join(distLocation, 'index.html');
const existTemplate = fs.existsSync(indexTemplate);

if (!existTemplate) {
  const err = new VError('missing file: "%s", run `yarn build:webui`', distLocation);
  /* eslint no-console:off */
  console.error(chalk.red(err.message));
  /* eslint no-console:off */
  process.exit(2);
}

const template = fs.readFileSync(indexTemplate).toString();

module.exports = function(config, auth, storage) {
  Search.configureStorage(storage);
  /* eslint new-cap:off */
  const router = express.Router();

  router.use(auth.webUIJWTmiddleware());
  router.use(securityIframe);

  // Static
  router.get('/-/static/:filename', function(req, res, next) {
    const file = `${distLocation}/${req.params.filename}`;
    res.sendFile(file, function(err) {
      if (!err) {
        return;
      }
      if (err.status === HTTP_STATUS.NOT_FOUND) {
        next();
      } else {
        next(err);
      }
    });
  });

  function renderHTML(req, res) {
    const base = combineBaseUrl(getWebProtocol(req.get(HEADERS.FORWARDED_PROTO), req.protocol), req.get('host'), config.url_prefix);
    const webPage = template
      .replace(/ToReplaceByVerdaccio/g, base)
      .replace(/ToReplaceByTitle/g, _.get(config, 'web.title') ? config.web.title : WEB_TITLE)
      .replace(/ToReplaceByLogo/g, _.get(config, 'web.logo') ? config.web.logo : '')
      .replace(/ToReplaceByScope/g, _.get(config, 'web.scope') ? config.web.scope : '');

    res.setHeader('Content-Type', 'text/html');

    res.send(webPage);
  }

  router.get('/-/web/:section/*', function(req, res) {
    renderHTML(req, res);
  });

  router.get('/', function(req, res) {
    renderHTML(req, res);
  });

  return router;
};
