const nock = require('nock');

function Plugin(config) {
  const self = Object.create(Plugin.prototype);
  self._config = config;
  return self;
}

Plugin.prototype.register_middlewares = function (app, auth, storage) {

  app.get('/test-uplink-timeout-*', function (req, res, next) {
    nock('http://localhost:55552')
      .get(req.path)
      .socketDelay(31000).reply(200); // 31s is greater than the default 30s connection timeout

    next();
  });

}

module.exports = Plugin;
