import bodyParser from 'body-parser';
import { Router } from 'express';

import { IAuth } from '@verdaccio/auth';
import { match, validateName, validatePackage } from '@verdaccio/middleware';
import { SearchInstance } from '@verdaccio/store';
import { Storage } from '@verdaccio/store';
import { Config } from '@verdaccio/types';

import addPackageWebApi from '../api/package';
import addReadmeWebApi from '../api/readme';
import addSearchWebApi from '../api/search';
import addSidebarWebApi from '../api/sidebar';
import addUserAuthApi from '../api/user';
import { hasLogin } from '../utils/web-utils';
import { setSecurityWebHeaders } from './security';

export function webAPI(config: Config, auth: IAuth, storage: Storage): Router {
  // eslint-disable-next-line new-cap
  const route = Router();
  SearchInstance.configureStorage(storage);

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble=
  route.param('package', validatePackage);
  route.param('filename', validateName);
  route.param('version', validateName);
  route.param('anything', match(/.*/));

  route.use(bodyParser.urlencoded({ extended: false }));
  route.use(auth.webUIJWTmiddleware());
  route.use(setSecurityWebHeaders);

  addPackageWebApi(route, storage, auth, config);
  addReadmeWebApi(route, storage, auth);
  addSidebarWebApi(route, config, storage, auth);
  addSearchWebApi(route, storage, auth);
  if (hasLogin(config)) {
    addUserAuthApi(route, auth, config);
  }
  // What are you looking for? logout? client side will remove token when user click logout,
  // or it will auto expire after 24 hours.
  // This token is different with the token send to npm client.
  // With JWT you will be able to setup expire tokens.
  return route;
}
