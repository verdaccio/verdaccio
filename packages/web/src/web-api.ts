import { Router } from 'express';
import bodyParser from 'body-parser';

import { SearchInstance } from '@verdaccio/store';
import { match, validateName, validatePackage, setSecurityWebHeaders } from '@verdaccio/middleware';
import { Config } from '@verdaccio/types';
import { IAuth, IStorageHandler } from '@verdaccio/dev-types';
import addSearchWebApi from './endpoint/search';
import addPackageWebApi from './endpoint/package';
import addUserAuthApi from './endpoint/user';

const route = Router(); /* eslint new-cap: 0 */

/*
 This file include all verdaccio only API(Web UI), for npm API please see ../endpoint/
*/
export function webAPI(config: Config, auth: IAuth, storage: IStorageHandler): Router {
  SearchInstance.configureStorage(storage);

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  // $FlowFixMe
  route.param('package', validatePackage);
  // $FlowFixMe
  route.param('filename', validateName);
  route.param('version', validateName);
  route.param('anything', match(/.*/));

  route.use(bodyParser.urlencoded({ extended: false }));
  route.use(auth.webUIJWTmiddleware());
  route.use(setSecurityWebHeaders);

  addPackageWebApi(route, storage, auth, config);
  addSearchWebApi(route, storage, auth);
  addUserAuthApi(route, auth, config);

  // What are you looking for? logout? client side will remove token when user click logout,
  // or it will auto expire after 24 hours.
  // This token is different with the token send to npm client.
  // With JWT you will be able to setup expire tokens.

  return route;
}
