/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-e2e-jest',
  verbose: true,
  collectCoverage: false,
  globalSetup: './e2e/pre-setup.js',
  globalTeardown: './e2e/teardown.js',
  testEnvironment: './e2e/puppeteer_environment.js',
  testRegex: '(/e2e.*\\.spec)\\.js'
};
