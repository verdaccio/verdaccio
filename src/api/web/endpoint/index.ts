import { Response, Router } from 'express';
import { limiter } from '../../rate-limiter';
import packageApi from './package';
import search from './search';
import user from './user';

export default (auth, storage, config) => {
  const route = Router(); /* eslint new-cap: 0 */
  route.use('/data/', limiter(config?.web?.rateLimit));
  route.use('/data/', packageApi(auth, storage, config));
  route.use('/data/', search(auth, storage));
  route.use('/sec/', limiter(config?.userRateLimit));
  route.use('/sec/', user(auth, storage));
  return route;
};
