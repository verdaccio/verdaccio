import buildDebug from 'debug';
import { Router } from 'express';
import _ from 'lodash';

import { asyncLoadPlugin } from '@verdaccio/loaders';
import { renderWebMiddleware, setSecurityWebHeaders } from '@verdaccio/middleware';

import webEndpointsApi from './api';

const debug = buildDebug('verdaccio:web');

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
      config?.serverSettings?.pluginPrefix ?? 'verdaccio-theme'
    );
    if (plugin.length > 1) {
      logger.warn('multiple ui themes are not supported , only the first plugin is used used');
    }

    return _.head(plugin);
  }
}

export default async (config: any, auth: any, storage: any): Promise<any> => {
  const pluginOptions = (await loadTheme(config)) || require('@verdaccio/ui-theme')(config.web);
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
