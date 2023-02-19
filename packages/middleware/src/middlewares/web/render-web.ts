import buildDebug from 'debug';
import express from 'express';
import fs from 'fs';
import path from 'path';

import { HTTP_STATUS } from '@verdaccio/core';
import { isURLhasValidProtocol } from '@verdaccio/url';

import { setSecurityWebHeaders } from './security';
import renderHTML from './utils/renderHTML';

const debug = buildDebug('verdaccio:web:render');

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

export function renderWebMiddleware(config, tokenMiddleware, pluginOptions) {
  const { staticPath, manifest, manifestFiles } = pluginOptions;
  debug('static path %o', staticPath);

  /* eslint new-cap:off */
  const router = express.Router();
  if (typeof tokenMiddleware === 'function') {
    router.use(tokenMiddleware);
  }

  router.use(setSecurityWebHeaders);

  // any match within the static is routed to the file system
  router.get('/-/static/*', function (req, res, next) {
    const filename = req.params[0];
    const file = `${staticPath}/${filename}`;
    debug('render static file %o', file);
    res.sendFile(file, sendFileCallback(next));
  });

  // check the origin of the logo
  if (config?.web?.logo && !isURLhasValidProtocol(config?.web?.logo)) {
    // URI related to a local file
    const absoluteLocalFile = path.posix.resolve(config.web.logo);
    debug('serve local logo %s', absoluteLocalFile);
    try {
      // TODO: replace existsSync by async alternative
      if (
        fs.existsSync(absoluteLocalFile) &&
        typeof fs.accessSync(absoluteLocalFile, fs.constants.R_OK) === 'undefined'
      ) {
        // Note: `path.join` will break on Windows, because it transforms `/` to `\`
        // Use POSIX version `path.posix.join` instead.
        config.web.logo = path.posix.join('/-/static/', path.basename(config.web.logo));
        router.get(config.web.logo, function (_req, res, next) {
          // @ts-ignore
          debug('serve custom logo  web:%s - local:%s', config.web.logo, absoluteLocalFile);
          res.sendFile(absoluteLocalFile, sendFileCallback(next));
        });
        debug('enabled custom logo %s', config.web.logo);
      } else {
        config.web.logo = undefined;
        debug(`web logo is wrong, path ${absoluteLocalFile} does not exist or is not readable`);
      }
    } catch {
      config.web.logo = undefined;
      debug(`web logo is wrong, path ${absoluteLocalFile} does not exist or is not readable`);
    }
  }

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
