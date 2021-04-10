import _ from 'lodash';
import express from 'express';
import buildDebug from 'debug';

import Search from '../../lib/search';
import { HTTP_STATUS } from '../../lib/constants';
import loadPlugin from '../../lib/plugin-loader';
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

export default function (config, auth, storage) {
  let { staticPath, manifest, manifestFiles } = loadTheme(config) || require('@verdaccio/ui-theme')();
  debug('static path %o', staticPath);
  Search.configureStorage(storage);

  /* eslint new-cap:off */
  const router = express.Router();
  router.use(auth.webUIJWTmiddleware());
  router.use(setSecurityWebHeaders);

  // static assets
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
