import buildDebug from 'debug';
import { Router } from 'express';
import _ from 'lodash';

import { renderWebMiddleware, setSecurityWebHeaders } from '@verdaccio/middleware';

import loadPlugin from '../../lib/plugin-loader';
import webEndpointsApi from './api';

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

export default (config, auth, storage) => {
  const pluginOptions = loadTheme(config) || require('@verdaccio/ui-theme')();
  // eslint-disable-next-line new-cap
  const router = Router();
  router.use(auth.webUIJWTmiddleware());
  router.use(setSecurityWebHeaders);
  // render web
  // @ts-ignore
  router.use('/', renderWebMiddleware(config, null, pluginOptions));
  // web endpoints, search, packages, etc
  router.use(webEndpointsApi(auth, storage, config));
  return router;
};
