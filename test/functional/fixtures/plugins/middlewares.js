function Plugin(config, stuff) {
  const self = Object.create(Plugin.prototype);

  self._config = config;
  return self;
}

Plugin.prototype.register_middlewares = function (app, auth, storage) {

  const {message} = this._config;
  app.get('/test/route', function (req, res, next) {
    res.status(200);

    return next({ ok: message })
  });

}

module.exports = Plugin;
