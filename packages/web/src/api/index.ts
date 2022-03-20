import { Router } from 'express';

import { hasLogin } from '../utils/web-utils';
import packageApi from './package';
import readme from './readme';
import search from './search';
import sidebar from './sidebar';
import user from './user';

export default (auth, storage, config) => {
  const route = Router(); /* eslint new-cap: 0 */
  route.use('/data/', packageApi(storage, auth, config));
  route.use('/data/', search(storage, auth, config));
  route.use('/data/', sidebar(config, storage, auth));
  route.use('/data/', readme(storage, auth));
  if (hasLogin(config)) {
    route.use('/sec/', user(auth, config));
  }
  return route;
};
