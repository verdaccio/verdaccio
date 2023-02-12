import buildDebug from 'debug';
import express from 'express';
import _ from 'lodash';

import { webMiddleware } from '@verdaccio/middleware';

import loadPlugin from '../../lib/plugin-loader';
import Search from '../../lib/search';
import webApi from './api';

const debug = buildDebug('verdaccio:web');

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

export default (config, auth, storage) => {
  const pluginOptions = loadTheme(config) || require('@verdaccio/ui-theme')();
  Search.configureStorage(storage);
  // eslint-disable-next-line new-cap
  const router = express.Router();
  // load application
  router.use(
    webMiddleware(
      config,
      {
        tokenMiddleware: auth.webUIJWTmiddleware(),
        webEndpointsApi: webApi(auth, storage, config),
      },
      pluginOptions
    )
  );
  return router;
};
