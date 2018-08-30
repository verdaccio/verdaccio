import fs from 'fs';
import path from 'path';

import express from 'express';
import _ from 'lodash';
import Search from '../../lib/search';
import * as Utils from '../../lib/utils';
import {HTTP_STATUS, WEB_TITLE} from '../../lib/constants';
import VError from 'verror';
import chalk from 'chalk';

const {securityIframe} = require('../middleware');
/* eslint new-cap:off */
const env = require('../../config/env');
const templatePath = path.join(env.DIST_PATH, '/index.html');
const existTemplate = fs.existsSync(templatePath);

if (!existTemplate) {
  const err = new VError('missing file: "%s", run `yarn build:webui`', templatePath);
  /* eslint no-console:off */
  console.error(chalk.red(err.message));
  /* eslint no-console:off */
  process.exit(2);
}

const template = fs.readFileSync(templatePath).toString();
const spliceURL = require('../../utils/string').spliceURL;

module.exports = function(config, auth, storage) {
  Search.configureStorage(storage);

  const router = express.Router();

  router.use(auth.webUIJWTmiddleware());
  router.use(securityIframe);

  // Static
  router.get('/-/static/:filename', function(req, res, next) {
    const file = `${env.DIST_PATH}/${req.params.filename}`;
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

  router.get('/-/verdaccio/logo', function(req, res) {
    const installPath = _.get(config, 'url_prefix', '');

    res.send(_.get(config, 'web.logo') || spliceURL(installPath, '/-/static/logo.png'));
  });

  router.get('/', function(req, res) {
    const base = Utils.combineBaseUrl(Utils.getWebProtocol(req), req.get('host'), config.url_prefix);
    let webPage = template
      .replace(/ToReplaceByVerdaccio/g, base)
      .replace(/ToReplaceByTitle/g, _.get(config, 'web.title') ? config.web.title : WEB_TITLE)
      .replace(/ToReplaceByScope/g, _.get(config, 'web.scope') ? config.web.scope : '');

    res.setHeader('Content-Type', 'text/html');

    res.send(webPage);
  });

  return router;
};
