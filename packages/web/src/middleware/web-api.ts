import bodyParser from 'body-parser';
import { Router } from 'express';

import { Auth } from '@verdaccio/auth';
import { validateName, validatePackage } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Config } from '@verdaccio/types';

import webEndpointsApi from '../api';
import { setSecurityWebHeaders } from './security';

export function webAPI(config: Config, auth: Auth, storage: Storage): Router {
  // eslint-disable-next-line new-cap
  const route = Router();
  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble=
  route.param('package', validatePackage);
  route.param('filename', validateName);
  route.param('version', validateName);
  route.use(bodyParser.urlencoded({ extended: false }));
  route.use(auth.webUIJWTmiddleware());
  route.use(setSecurityWebHeaders);
  route.use(webEndpointsApi(auth, storage, config));
  return route;
}
