import RateLimit from 'express-rate-limit';
import { defaultUserRateLimiting } from '../lib/auth-utils';

// @ts-ignore
const limiter = (userRateLimit) => {
  // @ts-ignore
  return new RateLimit({
    defaultUserRateLimiting,
    ...userRateLimit,
  });
};

export { limiter };
