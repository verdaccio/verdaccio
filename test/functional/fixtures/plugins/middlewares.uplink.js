const nock = require('nock');

function Plugin(config) {
  const self = Object.create(Plugin.prototype);
  self._config = config;
  return self;
}

Plugin.prototype.register_middlewares = function (app, auth, storage) {

  app.get('/test-uplink-timeout-*', function (req, res, next) {
    // https://github.com/nock/nock#readme
    nock('http://localhost:55552')
      .get(req.path)
      // 31s is greater than the default 30s connection timeout
      .socketDelay(50000)
      // http-status 200 OK
      .reply(200);

    next();
  });

};

module.exports = Plugin;
