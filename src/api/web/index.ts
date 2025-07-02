import buildDebug from 'debug';
import express, { Router } from 'express';
import _ from 'lodash';

import { PLUGIN_CATEGORY } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import { logger } from '@verdaccio/logger';
import {
  renderWebMiddleware,
  setSecurityWebHeaders,
  validateName,
  validatePackage,
} from '@verdaccio/middleware';
import defaultTheme from '@verdaccio/ui-theme';

import webEndpointsApi from './api';

const debug = buildDebug('verdaccio:web');
export const PLUGIN_UI_PREFIX = 'verdaccio-theme';
export const DEFAULT_PLUGIN_UI_THEME = '@verdaccio/ui-theme';

export async function loadTheme(config: any) {
  if (_.isNil(config.theme) === false) {
    const plugin = await asyncLoadPlugin(
      config.theme,
      { config, logger },
      // TODO: add types { staticPath: string; manifest: unknown; manifestFiles: unknown }
      function (plugin: any) {
        /**
                 *
                 - `staticPath`: is the same data returned in Verdaccio 5.
                 - `manifest`: A webpack manifest object.
                 - `manifestFiles`: A object with one property `js` and the array (order matters) of the manifest id to be loaded in the template dynamically.
                 */
        return plugin.staticPath && plugin.manifest && plugin.manifestFiles;
      },
      true,
      config?.serverSettings?.pluginPrefix ?? PLUGIN_UI_PREFIX,
      PLUGIN_CATEGORY.THEME
    );
    if (plugin.length > 1) {
      logger.warn('multiple ui themes are not supported; only the first plugin is used');
    }

    return _.head(plugin);
  }
}

export function localWebEndpointsApi(auth, storage, config): Router {
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

export default async (config, auth, storage, logger) => {
  let pluginOptions = await loadTheme(config);
  if (!pluginOptions) {
    debug('no theme plugin found, using default theme');
    pluginOptions = defaultTheme(config.web);
    logger.info(
      { name: DEFAULT_PLUGIN_UI_THEME, pluginCategory: PLUGIN_CATEGORY.THEME },
      'plugin @{name} successfully loaded (@{pluginCategory})'
    );
  }

  const router = Router();
  router.use('/', renderWebMiddleware(config, auth.apiJWTmiddleware(), pluginOptions));
  // web endpoints, search, packages, etc
  router.use(localWebEndpointsApi(auth, storage, config));
  return router;
};
