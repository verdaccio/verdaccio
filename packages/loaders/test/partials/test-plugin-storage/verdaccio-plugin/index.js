class ValidVerdaccioPlugin {
  config;
  options;
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  authenticate() {}
}

module.exports = (...rest) => new ValidVerdaccioPlugin(...rest);
