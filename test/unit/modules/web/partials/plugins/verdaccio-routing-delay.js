const { setImmediate } = require('node:timers/promises');

module.exports = () => ({
  register_middlewares(app) {
    app.use(async (_req, res, next) => {
      await setImmediate();
      res.setHeader('x-async-middleware', 'executed');
      next();
    });
  },
});
