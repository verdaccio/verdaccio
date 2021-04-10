import express from 'express';
import { renderWebMiddleware } from './middleware/render-web';
import { webAPI } from './middleware/web-api';

export default (config, auth, storage) => {
  // eslint-disable-next-line new-cap
  const app = express.Router();
  // load application
  app.use('/', renderWebMiddleware(config, auth, storage));
  // web endpoints, search, packages, etc
  app.use('/-/verdaccio/', webAPI(config, auth, storage));
  return app;
};
