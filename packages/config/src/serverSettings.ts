export default {
  // https://www.npmjs.com/package/express-rate-limit
  // values are intended to be high, please customize based on own needs
  rateLimit: {
    windowMs: 1000,
    max: 10000,
  },
  // deprecated
  keepAliveTimeout: 60,
};
