import buildDebug from 'debug';
import express from 'express';
import _ from 'lodash';

import { webMiddleware } from '@verdaccio/middleware';
import { SearchMemoryIndexer } from '@verdaccio/search';

import loadPlugin from '../../lib/plugin-loader';
import webApi from './api';

const debug = buildDebug('verdaccio:web');

export function loadTheme(config) {
  if (_.isNil(config.theme) === false) {
    debug('loading custom ui theme');
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

export default async (config, auth, storage) => {
  const pluginOptions = loadTheme(config) || require('@verdaccio/ui-theme')();
  SearchMemoryIndexer.configureStorage(storage);
  await SearchMemoryIndexer.init();
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
