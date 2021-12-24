import { Response, Router } from 'express';
import { limiter } from '../../../rate-limiter';
import profile from './profile';
import token from './token';
import v1Search from './search';

export default (auth, storage, config) => {
  const route = Router(); /* eslint new-cap: 0 */
  route.use('/-/npm/v1/', limiter(config?.userRateLimit));
  route.use('/-/npm/v1/', profile(auth));
  route.use('/-/npm/v1/', token(auth, storage, config));
  return route;
};
