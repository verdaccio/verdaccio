import RateLimit from 'express-rate-limit';

import type { RateLimit as RateLimitType } from '@verdaccio/types';

export function rateLimit(rateLimitOptions?: RateLimitType) {
  const limiter = RateLimit(rateLimitOptions);
  return limiter;
}
