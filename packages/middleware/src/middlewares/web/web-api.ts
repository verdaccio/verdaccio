import express from 'express';
import { RequestHandler, Router } from 'express';

import { validateName, validatePackage } from '../validation';
import { setSecurityWebHeaders } from './security';

export function webAPIMiddleware(
  tokenMiddleware: RequestHandler,
  webEndpointsApi: RequestHandler
): Router {
  // eslint-disable-next-line new-cap
  const route = Router();
  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble=
  route.param('package', validatePackage);
  route.param('filename', validateName);
  route.param('version', validateName);
  route.use(express.urlencoded({ extended: false }));
  route.use(setSecurityWebHeaders);

  if (typeof tokenMiddleware === 'function') {
    route.use(tokenMiddleware);
  }

  if (typeof webEndpointsApi === 'function') {
    route.use(webEndpointsApi);
  }

  return route;
}
