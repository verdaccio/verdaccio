import RateLimit from 'express-rate-limit';

// we limit max 1000 request per 15 minutes on user endpoints
const defaultUserRateLimiting = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
};
// @ts-ignore
const limiter = new RateLimit(defaultUserRateLimiting);

export { limiter };
