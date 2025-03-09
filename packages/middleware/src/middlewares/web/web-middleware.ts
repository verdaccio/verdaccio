import express from 'express';

import { renderWebMiddleware } from './render-web';
import { webAPIMiddleware } from './web-api';
import { WebUrlsNamespace } from './web-urls';

export default (config, middlewares, pluginOptions): any => {
  // eslint-disable-next-line new-cap
  const router = express.Router();
  const { tokenMiddleware, webEndpointsApi } = middlewares;
  // render web
  router.use(WebUrlsNamespace.root, renderWebMiddleware(config, tokenMiddleware, pluginOptions));
  // web endpoints: search, packages, readme, sidebar, etc
  router.use(WebUrlsNamespace.endpoints, webAPIMiddleware(tokenMiddleware, webEndpointsApi));
  return router;
};
