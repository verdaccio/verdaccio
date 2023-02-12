import express from 'express';
import { Router } from 'express';

import { validateName, validatePackage } from '../validation';
import { setSecurityWebHeaders } from './security';

export function webMiddleware(tokenMiddleware, webEndpointsApi) {
  // eslint-disable-next-line new-cap
  const route = Router();
  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble=
  route.param('package', validatePackage);
  route.param('filename', validateName);
  route.param('version', validateName);
  route.use(express.urlencoded({ extended: false }));

  if (typeof tokenMiddleware === 'function') {
    route.use(tokenMiddleware);
  }

  route.use(setSecurityWebHeaders);

  if (webEndpointsApi) {
    route.use(webEndpointsApi);
  }
  return route;
}
