import { Router } from 'express';

import { rateLimit } from '@verdaccio/middleware';

import { hasLogin } from '../../../lib/utils';
import packageApi from './package';
import search from './search';
import user from './user';

export default (auth, storage, config) => {
  // eslint-disable-next-line new-cap
  const router = Router();
  router.use('/data/',
    rateLimit({
      windowMs: 2 * 60 * 1000, // 2  minutes
      max: 5000, // limit each IP to 1000 requests per windowMs
      ...config?.web?.rateLimit,
    })
  );
  router.use(packageApi(storage, auth, config));
  router.use(search(storage, auth));
  if (hasLogin(config)) {
    router.use(user(auth, storage));
  }
  return router;
};
