import path from 'path';
import _ from 'lodash';
import buildDebug from 'debug';
import express from 'express';

import { SearchInstance } from '@verdaccio/store';
import { HTTP_STATUS } from '@verdaccio/commons-api';
import { loadPlugin } from '@verdaccio/loaders';
import { isURLhasValidProtocol } from '@verdaccio/url';
import renderHTML from '../renderHTML';
import { setSecurityWebHeaders } from './security';

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
  const pluginTheme = require('@verdaccio/ui-theme');
  const { staticPath } = pluginTheme;
  debug('static path %o', staticPath);
  SearchInstance.configureStorage(storage);

  /* eslint new-cap:off */
  const router = express.Router();
  router.use(auth.webUIJWTmiddleware());
  router.use(setSecurityWebHeaders);

  // Logo
  let logoURI = config?.web?.logo ?? '';
  if (logoURI && !isURLhasValidProtocol(logoURI)) {
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
    debug('render static file %o', file);
    res.sendFile(file, sendFileCallback(next));
  });

  router.get('/-/web/:section/*', function (req, res) {
    renderHTML(config, req, res);
    debug('render html section');
  });

  router.get('/', function (req, res) {
    renderHTML(config, req, res);
    debug('render root');
  });

  return router;
}
