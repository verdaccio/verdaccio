import path from 'path';
import _ from 'lodash';
import buildDebug from 'debug';
import express from 'express';

import { combineBaseUrl, getWebProtocol } from '@verdaccio/utils';
import { SearchInstance } from '@verdaccio/store';
import { WEB_TITLE } from '@verdaccio/config';
import { HEADERS, HTTP_STATUS } from '@verdaccio/commons-api';
import { loadPlugin } from '@verdaccio/loaders';
import LRU from 'lru-cache';
import { setSecurityWebHeaders } from '@verdaccio/middleware';
import renderTemplate, { TemplateUIOptions } from './template';
import { isHTTPProtocol } from './web-utils2';

const pkgJSON = require('../package.json');
const DEFAULT_LANGUAGE = 'es-US';
const cache = new LRU({ max: 500, maxAge: 1000 * 60 * 60 });
const debug = buildDebug('verdaccio:web:render');

export function loadTheme(config) {
  if (_.isNil(config.theme) === false) {
    return _.head(
      loadPlugin(
        config,
        config.theme,
        {},
        function (plugin) {
          return _.isString(plugin);
        },
        'verdaccio-theme'
      )
    );
  }
}

export function validatePrimaryColor(primaryColor) {
  const isHex = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i.test(primaryColor);
  if (!isHex) {
    return '';
  }

  return primaryColor;
}

const sendFileCallback = (next) => (err) => {
  if (!err) {
    return;
  }
  if (err.status === HTTP_STATUS.NOT_FOUND) {
    next();
  } else {
    next(err);
  }
};

export function renderWebMiddleware(config, auth, storage): any {
  const { staticPath, manifest } = require('@verdaccio/ui-theme');
  const manifestFiles = {
    js: ['runtime.js', 'vendors.js', 'main.js'],
    css: ['main.css'],
    ico: 'ico.co',
  };
  SearchInstance.configureStorage(storage);

  /* eslint new-cap:off */
  const router = express.Router();
  router.use(auth.webUIJWTmiddleware());
  router.use(setSecurityWebHeaders);
  // Logo
  let logoURI = _.get(config, 'web.logo') ? config.web.logo : '';
  if (logoURI && !isHTTPProtocol(logoURI)) {
    // URI related to a local file

    // Note: `path.join` will break on Windows, because it transforms `/` to `\`
    // Use POSIX version `path.posix.join` instead.
    logoURI = path.posix.join('/-/static/', path.basename(logoURI));
    router.get(logoURI, function (req, res, next) {
      res.sendFile(path.resolve(config.web.logo), sendFileCallback(next));
      debug('render static');
    });
  }

  // Static
  router.get('/-/static/*', function (req, res, next) {
    const filename = req.params[0];
    const file = `${staticPath}/${filename}`;
    res.sendFile(file, sendFileCallback(next));
    debug('render static');
  });

  function renderHTML(req, res) {
    const protocol = getWebProtocol(req.get(HEADERS.FORWARDED_PROTO), req.protocol);
    const host = req.get('host');
    const { url_prefix } = config;
    const uri = `${protocol}://${host}`;
    const base = combineBaseUrl(protocol, host, url_prefix);
    const language = config?.i18n?.web ?? DEFAULT_LANGUAGE;
    const darkMode = config?.web?.darkMode ?? false;
    const title = config?.web?.title ?? WEB_TITLE;
    const scope = config?.web?.scope ?? '';
    const version = pkgJSON.version;
    const primaryColor = validatePrimaryColor(config?.web?.primary_color);
    const options = {
      uri,
      darkMode,
      protocol,
      host,
      url_prefix,
      base,
      primaryColor,
      version,
      logoURI,
      title,
      scope,
      language,
    };

    let webPage;

    try {
      webPage = cache.get('template');

      if (!webPage) {
        webPage = renderTemplate(
          {
            manifest: manifestFiles,
            options,
          },
          manifest
        );
        cache.set('template', webPage);
        debug('set template cache');
      } else {
        debug('reuse template cache');
      }
    } catch (error) {
      throw new Error(`theme could not be load, stack ${error.stack}`);
    }
    res.setHeader('Content-Type', HEADERS.TEXT_HTML);
    res.send(webPage);
    debug('render web');
  }

  router.get('/-/web/:section/*', function (req, res) {
    renderHTML(req, res);
    debug('render html section');
  });

  router.get('/', function (req, res) {
    renderHTML(req, res);
    debug('render root');
  });

  return router;
}
