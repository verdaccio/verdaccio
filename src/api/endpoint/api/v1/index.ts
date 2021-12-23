import { Response, Router } from 'express';
import profile from './profile';
import token from './token';
import v1Search from './search';

export default (auth, storage, config) => {
  const route = Router(); /* eslint new-cap: 0 */
  route.use(profile(auth));
  route.use(token(auth, storage, config));
  return route;
};
