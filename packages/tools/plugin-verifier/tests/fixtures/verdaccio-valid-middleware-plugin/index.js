class ValidMiddlewarePlugin {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  register_middlewares(_app, _auth, _storage) {}
}

module.exports = (...args) => new ValidMiddlewarePlugin(...args);
