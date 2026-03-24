import buildDebug from 'debug';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

import { HEADERS, HTTP_STATUS } from '@verdaccio/core';
import { isURLhasValidProtocol } from '@verdaccio/url';

import { setSecurityWebHeaders } from './security';
import renderHTML from './utils/renderHTML';
import { getUIOptions } from './utils/ui-options';
import { WebUrlsNamespace } from './web-urls';

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
  router.get(
    WebUrlsNamespace.static,
    function (req: express.Request<{ all: string | string[] }>, res, next) {
      const filename = Array.isArray(req.params.all) ? req.params.all.join('/') : req.params.all;
      if (filename === 'favicon.ico' && config?.web?.favicon) {
        const file = config?.web?.favicon;
        if (isURLhasValidProtocol(file)) {
          debug('redirect to favicon %s', file);
          req.url = file;
          return next();
        }
        debug('render custom favicon %o', file);
        res.sendFile(file, sendFileCallback(next));
        return;
      }
      debug('render static file %o', filename);
      res.sendFile(filename, { root: staticPath }, sendFileCallback(next));
    }
  );

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
          logo = `/-/static/${path.basename(logo)}`;
          router.get(logo, function (_req, res, next) {
            // @ts-ignore
            debug('serve custom logo  web:%s - local:%s', logo, absoluteLocalFile);
            res.sendFile(
              path.basename(absoluteLocalFile),
              { root: path.dirname(absoluteLocalFile) },
              sendFileCallback(next)
            );
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

  // Serve external script that loads UI options
  router.get(WebUrlsNamespace.static + 'ui-options.js', function (req, res) {
    const options = getUIOptions(config, req, res);
    const script = `window.__VERDACCIO_BASENAME_UI_OPTIONS=${JSON.stringify(options)};`;
    res.setHeader(HEADERS.CACHE_CONTROL, HEADERS.NO_CACHE);
    res.setHeader(HEADERS.CONTENT_TYPE, HEADERS.JAVASCRIPT_CHARSET);
    res.send(script);
  });

  // Handle all web routes including security routes
  router.get(WebUrlsNamespace.web, function (req, res) {
    const options = getUIOptions(config, req, res);
    renderHTML(config, manifest, manifestFiles, options, res);
    debug('render html section');
  });

  router.get(WebUrlsNamespace.root, function (req, res) {
    const options = getUIOptions(config, req, res);
    renderHTML(config, manifest, manifestFiles, options, res);
    debug('render root');
  });

  return router;
}
