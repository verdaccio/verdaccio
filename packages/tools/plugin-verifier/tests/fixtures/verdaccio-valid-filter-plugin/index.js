class ValidFilterPlugin {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  async filter_metadata(manifest) {
    return manifest;
  }
}

module.exports = (...args) => new ValidFilterPlugin(...args);
