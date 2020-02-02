function Plugin(config, pluginOptions) {
  const self = Object.create(Plugin.prototype);

  self._config = config;
  self._logger = pluginOptions.logger;
  return self;
}

Plugin.prototype.register_middlewares = function (app) {

  const {message} = this._config;
  app.get('/test/route', function (req, res, next) {
    res.status(200);

    return next({ ok: message })
  });
};

module.exports = Plugin;
