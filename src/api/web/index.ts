import buildDebug from 'debug';
import express, { RequestHandler, Router } from 'express';
import _ from 'lodash';

import {
  renderWebMiddleware,
  setSecurityWebHeaders,
  validateName,
  validatePackage,
} from '@verdaccio/middleware';

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

export function localWebEndpointsApi(auth, storage, config): Router {
  // eslint-disable-next-line new-cap
  const route = Router();
  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble=
  route.param('package', validatePackage);
  route.param('filename', validateName);
  route.param('version', validateName);
  route.use(express.urlencoded({ extended: false }));
  route.use(setSecurityWebHeaders);
  route.use(auth.apiJWTmiddleware());
  route.use(webEndpointsApi(auth, storage, config));

  return route;
}

export default (config, auth, storage) => {
  const pluginOptions = loadTheme(config) || require('@verdaccio/ui-theme')();
  // eslint-disable-next-line new-cap
  const router = Router();
  // @ts-ignore
  router.use('/', renderWebMiddleware(config, auth.apiJWTmiddleware(), pluginOptions));
  // web endpoints, search, packages, etc
  router.use(localWebEndpointsApi(auth, storage, config));
  return router;
};
