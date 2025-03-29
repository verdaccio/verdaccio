class ValidVerdaccioPlugin {
  config;
  options;
  constructor(config, options) {
    console.log('ValidVerdaccioPlugin constructor', config);
    this.config = config;
    this.options = options;
  }

  authenticate() {}
}

module.exports = (...rest) => new ValidVerdaccioPlugin(...rest);
