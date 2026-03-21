class ValidAuthPlugin {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  authenticate(_user, _password, cb) {
    cb(null, [_user]);
  }

  allow_access(_user, _pkg, cb) {
    cb(null, true);
  }

  allow_publish(_user, _pkg, cb) {
    cb(null, true);
  }
}

module.exports = (...args) => new ValidAuthPlugin(...args);
