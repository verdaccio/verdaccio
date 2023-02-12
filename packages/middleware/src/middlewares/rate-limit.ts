import RateLimit from 'express-rate-limit';

import { RateLimit as RateLimitType } from '@verdaccio/types';

export function rateLimit(rateLimitOptions?: RateLimitType) {
  const limiter = new RateLimit(rateLimitOptions);
  return limiter;
}
