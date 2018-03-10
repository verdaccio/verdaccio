import {Router} from 'express';
import bodyParser from 'body-parser';
import addUserAuthApi from './endpoint/user';
import addPackageWebApi from './endpoint/package';
import addSearchWebApi from './endpoint/search';

import Search from '../../lib/search';
import {match, validate_name, validatePackage, securityIframe} from '../middleware';

const route = Router(); /* eslint new-cap: 0 */

/*
 This file include all verdaccio only API(Web UI), for npm API please see ../endpoint/
*/
module.exports = function(config, auth, storage) {

  Search.configureStorage(storage);

  // validate all of these params as a package name
  // this might be too harsh, so ask if it causes trouble
  route.param('package', validatePackage);
  route.param('filename', validate_name);
  route.param('version', validate_name);
  route.param('anything', match(/.*/));

  route.use(bodyParser.urlencoded({extended: false}));
  route.use(auth.jwtMiddleware());
  route.use(securityIframe);

  addPackageWebApi(route, storage, auth);
  addSearchWebApi(route, storage, auth);
  addUserAuthApi(route, auth, config);

  // What are you looking for? logout? client side will remove token when user click logout,
  // or it will auto expire after 24 hours.
  // This token is different with the token send to npm client.
  // We will/may replace current token with JWT in next major release, and it will not expire at all(configurable).

  return route;
};
