import RateLimit from 'express-rate-limit';
import { RateLimit as RateLimitType } from '@verdaccio/types';
import { defaultUserRateLimiting } from '../lib/auth-utils';

const limiter = (userRateLimit: RateLimitType) => {
  // @ts-ignore
  return new RateLimit({
    ...userRateLimit,
  });
};

export { limiter };
