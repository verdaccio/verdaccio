
module.exports = Plugin

function Plugin(config, stuff) {
  var self = Object.create(Plugin.prototype)
  self._config = config
  return self
}

Plugin.prototype.register_middlewares = function (app, auth, storage) {
  var message = this._config.message

  app.get('/test/route', function (req, res, next) {
    res.status(200)
    return next({ ok: message })
  });
}
