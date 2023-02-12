import express from 'express';
import _ from 'lodash';

import { asyncLoadPlugin } from '@verdaccio/loaders';
import { logger } from '@verdaccio/logger';
import { webMiddleware } from '@verdaccio/middleware';

import webEndpointsApi from './api';

export async function loadTheme(config: any) {
  if (_.isNil(config.theme) === false) {
    const plugin = await asyncLoadPlugin(
      config.theme,
      { config, logger },
      // TODO: add types { staticPath: string; manifest: unknown; manifestFiles: unknown }
      function (plugin: any) {
        return plugin.staticPath && plugin.manifest && plugin.manifestFiles;
      },
      config?.serverSettings?.pluginPrefix ?? 'verdaccio-theme'
    );
    if (plugin.length > 1) {
      logger.warn('multiple ui themes are not supported , only the first plugin is used used');
    }

    return _.head(plugin);
  }
}

export default async (config, auth, storage) => {
  const pluginOptions = (await loadTheme(config)) || require('@verdaccio/ui-theme')();

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
