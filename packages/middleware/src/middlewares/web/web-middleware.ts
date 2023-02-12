import express from 'express';

import { renderWebMiddleware } from './render-web';
import { webMiddleware } from './web-api';

export default (config, middlewares, pluginOptions): any => {
  // eslint-disable-next-line new-cap
  const router = express.Router();
  const { tokenMiddleware, webEndpointsApi } = middlewares;
  // render web
  router.use('/', renderWebMiddleware(config, tokenMiddleware, pluginOptions));
  // web endpoints, search, packages, etc
  router.use('/-/verdaccio/', webMiddleware(tokenMiddleware, webEndpointsApi));
  return router;
};
