/* eslint comma-dangle: 0 */

module.exports = {
  'name': 'verdaccio-e2e-jest',
  'verbose': true,
  'collectCoverage': false,
  'globalSetup': './test/e2e/pre-setup.js',
  'globalTeardown': './test/e2e/teardown.js',
  'testEnvironment': './test/e2e/puppeteer_environment.js',
  'testRegex': '(/test/e2e/e2e.*\\.spec)\\.js'
};
