import { Router } from 'express';

import { rateLimit } from '@verdaccio/middleware';

import { hasLogin } from '../../../lib/utils';
import packageApi from './package';
import search from './search';
import user from './user';

export default (auth, storage, config): any => {
  // eslint-disable-next-line new-cap
  const router = Router();
  router.use(
    rateLimit({
      windowMs: 2 * 60 * 1000, // 2  minutes
      max: 5000, // limit each IP to 1000 requests per windowMs
      ...config?.web?.rateLimit,
    })
  );
  packageApi(router, storage, auth, config);
  search(router, storage, auth);
  if (hasLogin(config)) {
    user(router, auth, storage);
  }
  return router;
};
