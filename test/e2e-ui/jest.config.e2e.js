const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  name: 'verdaccio-e2e-jest',
  verbose: true,
  collectCoverage: false,
  globalSetup: './pre-setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './puppeteer_environment.js',
  testRegex: '(/e2e.*\\.spec)\\.js',
});
