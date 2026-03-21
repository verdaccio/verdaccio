// ES6-style plugin with default export
class ValidAuthES6Plugin {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  authenticate(_user, _password, cb) {
    cb(null, [_user]);
  }
}

Object.defineProperty(exports, '__esModule', { value: true });
exports.default = ValidAuthES6Plugin;
