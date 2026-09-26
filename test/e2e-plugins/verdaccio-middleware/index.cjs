/**
 * A middleware plugin, registered the way third-party ones are, so the battery proves
 * that registering one does not shadow the registry or web routes.
 *
 * It only stamps a header: any route it broke would show up as a failing test, not as
 * an assertion here.
 */
class E2EMiddleware {
  constructor(config, options) {
    this.logger = options.logger;
  }

  register_middlewares(app) {
    app.use((req, res, next) => {
      res.setHeader('x-verdaccio-e2e-middleware', 'on');
      next();
    });
  }
}

module.exports = { default: E2EMiddleware };
