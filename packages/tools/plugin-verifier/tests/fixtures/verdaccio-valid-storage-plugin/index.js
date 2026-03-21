class ValidStoragePlugin {
  constructor(config, options) {
    this.config = config;
    this.options = options;
  }

  async init() {}
  async getSecret() {
    return 'secret';
  }
  async setSecret() {}
  getPackageStorage() {
    return {};
  }
  async add() {}
  async remove() {}
  async get() {
    return [];
  }
  async search() {
    return [];
  }
  async saveToken() {}
  async deleteToken() {}
  async readTokens() {
    return [];
  }
}

module.exports = (...args) => new ValidStoragePlugin(...args);
