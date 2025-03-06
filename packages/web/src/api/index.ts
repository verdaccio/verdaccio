import { Router } from 'express';

import { WebUrlsNamespace, rateLimit } from '@verdaccio/middleware';

import { hasLogin } from '../web-utils';
import packageApi from './package';
import readme from './readme';
import search from './search';
import sidebar from './sidebar';
import user from './user';

export default (auth, storage, config) => {
  const route = Router(); /* eslint new-cap: 0 */
  route.use(
    WebUrlsNamespace.data,
    rateLimit({
      windowMs: 2 * 60 * 1000, // 2  minutes
      max: 5000, // limit each IP to 1000 requests per windowMs
      ...config?.web?.rateLimit,
    })
  );
  route.use(WebUrlsNamespace.data, packageApi(storage, auth, config));
  route.use(WebUrlsNamespace.data, search(storage, auth));
  route.use(WebUrlsNamespace.data, sidebar(config, storage, auth));
  route.use(WebUrlsNamespace.data, readme(storage, auth));
  if (hasLogin(config)) {
    route.use(WebUrlsNamespace.sec, user(auth, config));
  }
  return route;
};
