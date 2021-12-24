import RateLimit from 'express-rate-limit';
import { RateLimit as RateLimitType } from '@verdaccio/types';

const limiter = (rateLimitOptions: RateLimitType) => {
  // @ts-ignore
  return new RateLimit({
    ...rateLimitOptions,
  });
};

export { limiter };
