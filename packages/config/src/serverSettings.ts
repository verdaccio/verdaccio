export default {
  // https://www.npmjs.com/package/express-rate-limit
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 10000,
  },
};
