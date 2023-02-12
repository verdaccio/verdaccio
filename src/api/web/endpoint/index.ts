import { Router } from 'express';

import { rateLimit } from '@verdaccio/middleware';

import { hasLogin } from '../../../lib/utils';
import packageApi from './package';
import search from './search';
import user from './user';

export default (auth, storage, config) => {
  const route = Router(); /* eslint new-cap: 0 */
  route.use(
    '/data/',
    rateLimit({
      windowMs: 2 * 60 * 1000, // 2  minutes
      max: 5000, // limit each IP to 1000 requests per windowMs
      ...config?.web?.rateLimit,
    })
  );
  route.use('/data/', packageApi(storage, auth, config));
  route.use('/data/', search(storage, auth));
  route.use('/sec/', rateLimit(config?.userRateLimit));
  if (hasLogin(config)) {
    route.use('/sec/', user(auth, storage));
  }
  return route;
};
