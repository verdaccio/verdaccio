import buildDebug from 'debug';
import express from 'express';
import _ from 'lodash';
import path from 'path';

import { HTTP_STATUS } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import { logger } from '@verdaccio/logger';
import { isURLhasValidProtocol } from '@verdaccio/url';

import renderHTML from '../renderHTML';
import { setSecurityWebHeaders } from './security';

const debug = buildDebug('verdaccio:web:render');

export async function loadTheme(config: any) {
  if (_.isNil(config.theme) === false) {
    const plugin = await asyncLoadPlugin(
      config.theme,
      { config, logger },
      function (plugin) {
        return typeof plugin === 'string';
      },
      config?.serverSettings?.pluginPrefix ?? 'verdaccio-theme'
    );
    if (plugin.length > 1) {
      logger.warn(
        'multiple ui themes has been detected and is not supported, only the first one will be used'
      );
    }

    return _.head(plugin);
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

export async function renderWebMiddleware(config, auth): Promise<any> {
  const { staticPath, manifest, manifestFiles } =
    (await loadTheme(config)) || require('@verdaccio/ui-theme')();
  debug('static path %o', staticPath);

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
    renderHTML(config, manifest, manifestFiles, req, res);
    debug('render html section');
  });

  router.get('/', function (req, res) {
    renderHTML(config, manifest, manifestFiles, req, res);
    debug('render root');
  });

  return router;
}
