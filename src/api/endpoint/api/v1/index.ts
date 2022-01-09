import { Response, Router } from 'express';

import profile from './profile';
import token from './token';

export default (auth, storage, config) => {
  const route = Router(); /* eslint new-cap: 0 */
  route.use('/-/npm/v1/', profile(auth, config));
  route.use('/-/npm/v1/', token(auth, storage, config));
  return route;
};
