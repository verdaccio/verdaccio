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
    let file = `${staticPath}/${filename}`;
    if (filename === 'favicon.ico' && config?.web?.favicon) {
      file = config?.web?.favicon;
      if (isURLhasValidProtocol(file)) {
        debug('redirect to favicon %s', file);
        req.url = file;
        return next();
      }
    }
    debug('render static file %o', file);
    res.sendFile(file, sendFileCallback(next));
  });

  function renderLogo(logo: string | undefined): string | undefined {
    // check the origin of the logo
    if (logo && !isURLhasValidProtocol(logo)) {
      // URI related to a local file
      const absoluteLocalFile = path.posix.resolve(logo);
      debug('serve local logo %s', absoluteLocalFile);
      try {
        // TODO: replace existsSync by async alternative
        if (
          fs.existsSync(absoluteLocalFile) &&
          typeof fs.accessSync(absoluteLocalFile, fs.constants.R_OK) === 'undefined'
        ) {
          // Note: `path.join` will break on Windows, because it transforms `/` to `\`
          // Use POSIX version `path.posix.join` instead.
          logo = path.posix.join('/-/static/', path.basename(logo));
          router.get(logo, function (_req, res, next) {
            // @ts-ignore
            debug('serve custom logo  web:%s - local:%s', logo, absoluteLocalFile);
            res.sendFile(absoluteLocalFile, sendFileCallback(next));
          });
          debug('enabled custom logo %s', logo);
        } else {
          logo = undefined;
          debug(`web logo is wrong, path ${absoluteLocalFile} does not exist or is not readable`);
        }
      } catch {
        logo = undefined;
        debug(`web logo is wrong, path ${absoluteLocalFile} does not exist or is not readable`);
      }
    }
    return logo;
  }

  const logo = renderLogo(config?.web?.logo);
  if (config?.web?.logo) {
    config.web.logo = logo;
  }
  const logoDark = renderLogo(config?.web?.logoDark);
  if (config?.web?.logoDark) {
    config.web.logoDark = logoDark;
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
