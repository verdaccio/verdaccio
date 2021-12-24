import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import express from 'express';
import buildDebug from 'debug';
import RateLimit from 'express-rate-limit';

import { Config } from '@verdaccio/types';

import Search from '../../lib/search';
import { HTTP_STATUS } from '../../lib/constants';
import loadPlugin from '../../lib/plugin-loader';
import { isHTTPProtocol } from '../../lib/utils';
import { logger } from '../../lib/logger';
import renderHTML from './html/renderHTML';

const { setSecurityWebHeaders } = require('../middleware');

const debug = buildDebug('verdaccio');

export function loadTheme(config) {
  if (_.isNil(config.theme) === false) {
    return _.head(
      loadPlugin(
        config,
        config.theme,
        {},
        function (plugin) {
          return plugin.staticPath && plugin.manifest && plugin.manifestFiles;
        },
        'verdaccio-theme'
      )
    );
  }
}

export function validatePrimaryColor(primaryColor) {
  const isHex = /^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/i.test(primaryColor);
  if (!isHex) {
    debug('invalid primary color %o', primaryColor);
    return;
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

export default function (config: Config, auth, storage) {
  let { staticPath, manifest, manifestFiles } = loadTheme(config) || require('@verdaccio/ui-theme')();
  debug('static path %o', staticPath);
  Search.configureStorage(storage);

  /* eslint new-cap:off */
  const router = express.Router();
  // limit 5k request on web peer 2 minutes is enough for a medium size company
  // @ts-ignore
  const limiter = new RateLimit({
    windowMs: 2 * 60 * 1000, // 2  minutes
    max: 5000, // limit each IP to 1000 requests per windowMs
    ...config?.web?.rateLimit,
  });
  // run in production mode by default, just in case
  // it shouldn't make any difference anyway
  router.use(limiter);
  router.use(auth.webUIJWTmiddleware());
  router.use(setSecurityWebHeaders);

  // static assets
  router.get('/-/static/*', function (req, res, next) {
    const filename = req.params[0];
    const file = `${staticPath}/${filename}`;
    debug('render static file %o', file);
    res.sendFile(file, sendFileCallback(next));
  });

  // logo
  if (config?.web?.logo && !isHTTPProtocol(config?.web?.logo)) {
    // URI related to a local file
    const absoluteLocalFile = path.posix.resolve(config.web.logo);
    debug('serve local logo %s', absoluteLocalFile);
    try {
      if (fs.existsSync(absoluteLocalFile) && typeof fs.accessSync(absoluteLocalFile, fs.constants.R_OK) === 'undefined') {
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
        logger.warn(`web logo is wrong, path ${absoluteLocalFile} does not exist or is not readable`);
      }
    } catch {
      config.web.logo = undefined;
      logger.warn(`web logo is wrong, path ${absoluteLocalFile} does not exist or is not readable`);
    }
  }

  router.get('/-/web/:section/*', function (req, res) {
    renderHTML(config, manifest, manifestFiles, req, res);
    debug('render html section');
  });

  router.get('/', function (req, res, next) {
    renderHTML(config, manifest, manifestFiles, req, res);
    debug('render root');
  });

  return router;
}
