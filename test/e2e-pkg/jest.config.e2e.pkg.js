const { defaults } = require('jest-config');

module.exports = {
  name: 'verdaccio-e2e-pkg-jest',
  verbose: true,
  collectCoverage: false,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
  testEnvironment: './env_babel.js',
  testRegex: '(/test/e2e.*\\.spec)\\.ts'
};
