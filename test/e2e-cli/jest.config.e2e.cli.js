const { defaults } = require('jest-config');
const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  name: 'verdaccio-e2e-cli-jest',
  verbose: true,
  collectCoverage: false,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  testEnvironment: './env_babel.js',
  globalSetup: './env_setup.js',
  globalTeardown: './env_teardown.js',
  // testRegex: '(/test/e2e.*\\.spec)\\.ts',
  testRegex: '(/test_bk/*.*.spec)\\.ts',
});
