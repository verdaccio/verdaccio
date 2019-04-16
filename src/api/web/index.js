/**
 * @prettier
 */

import _ from 'lodash';
import fs from 'fs';

import path from 'path';
import express from 'express';

import { combineBaseUrl, getWebProtocol } from '../../lib/utils';
import Search from '../../lib/search';
import { HEADERS, HTTP_STATUS, WEB_TITLE } from '../../lib/constants';
import loadPlugin from '../../lib/plugin-loader';

const { securityIframe } = require('../middleware');
const pkgJSON = require('../../../package.json');

export function loadTheme(config) {
  if (_.isNil(config.theme) === false) {
    return _.head(
      loadPlugin(
        config,
        config.theme,
        {},
        function(plugin) {
          return _.isString(plugin);
        },
        'verdaccio-theme'
      )
    );
  }
}

module.exports = function(config, auth, storage) {
  Search.configureStorage(storage);
  /* eslint new-cap:off */
  const router = express.Router();

  router.use(auth.webUIJWTmiddleware());
  router.use(securityIframe);
  const themePath = loadTheme(config) || require('@verdaccio/ui-theme')();
  const indexTemplate = path.join(themePath, 'index.html');
  const template = fs.readFileSync(indexTemplate).toString();

  // Static
  router.get('/-/static/*', function(req, res, next) {
    const filename = req.params[0];

    const file = `${themePath}/${filename}`;
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
      .replace(/ToReplaceByVersion/g, pkgJSON.version)
      .replace(/ToReplaceByTitle/g, _.get(config, 'web.title') ? config.web.title : WEB_TITLE)
      .replace(/ToReplaceByLogo/g, _.get(config, 'web.logo') ? config.web.logo : '')
      .replace(/ToReplaceByScope/g, _.get(config, 'web.scope') ? config.web.scope : '');

    res.setHeader('Content-Type', HEADERS.TEXT_HTML);

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
