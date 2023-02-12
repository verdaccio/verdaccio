import RateLimit from 'express-rate-limit';

import { RateLimit as RateLimitType } from '@verdaccio/types';

export function rateLimit(rateLimitOptions?: RateLimitType) {
  if (!rateLimitOptions) {
    return (_res, _req, next) => {
      return next();
    };
  }

  const limiter = new RateLimit(rateLimitOptions);
  return limiter;
}
