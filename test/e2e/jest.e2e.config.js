/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-e2e-jest',
  verbose: true,
  collectCoverage: false,
  globalSetup: './pre-setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './puppeteer_environment.js',
  testRegex: '(/e2e.*\\.spec)\\.js'
};
