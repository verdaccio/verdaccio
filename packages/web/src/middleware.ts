import express from 'express';
import _ from 'lodash';

import { PLUGIN_CATEGORY, PLUGIN_UI_PREFIX } from '@verdaccio/core';
import { asyncLoadPlugin } from '@verdaccio/loaders';
import { logger } from '@verdaccio/logger';
import { webMiddleware } from '@verdaccio/middleware';

import webEndpointsApi from './api';

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
      false,
      config.server?.pluginPrefix ?? PLUGIN_UI_PREFIX,
      PLUGIN_CATEGORY.THEME
    );
    if (plugin.length > 1) {
      logger.warn('multiple ui themes are not supported; only the first plugin is used');
    }

    return _.head(plugin);
  }
}

export default async (config, auth, storage, logger) => {
  let pluginOptions = await loadTheme(config);
  if (!pluginOptions) {
    pluginOptions = require(DEFAULT_PLUGIN_UI_THEME)(config.web);
    logger.info(
      { name: DEFAULT_PLUGIN_UI_THEME, pluginCategory: PLUGIN_CATEGORY.THEME },
      'plugin @{name} successfully loaded (@{pluginCategory})'
    );
  }

  // eslint-disable-next-line new-cap
  const router = express.Router();
  // load application
  router.use(
    webMiddleware(
      config,
      {
        tokenMiddleware: auth.webUIJWTmiddleware(),
        webEndpointsApi: webEndpointsApi(auth, storage, config),
      },
      pluginOptions
    )
  );
  return router;
};
