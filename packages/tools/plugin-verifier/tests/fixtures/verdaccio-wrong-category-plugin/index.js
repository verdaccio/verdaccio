// This is a valid middleware plugin, but will fail sanity check if tested as auth
class WrongCategoryPlugin {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  register_middlewares(_app, _auth, _storage) {}
}

module.exports = (...args) => new WrongCategoryPlugin(...args);
