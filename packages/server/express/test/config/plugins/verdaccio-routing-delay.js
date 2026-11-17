module.exports = function (config) {
  return {
    register_middlewares(app) {
      app.use((_req, _res, next) => {
        if (config.defer) {
          return Promise.resolve().then(() => next());
        }
        next();
      });
    },
  };
};
