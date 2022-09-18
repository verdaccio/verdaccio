const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  name: 'verdaccio-e2e-jest',
  verbose: false,
  collectCoverage: false,
  globalSetup: './pre-setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './puppeteer_environment.js',
});
