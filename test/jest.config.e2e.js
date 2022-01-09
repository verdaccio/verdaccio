/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-e2e-jest',
  verbose: true,
  collectCoverage: false,
  globalSetup: './e2e/pre-setup.js',
  globalTeardown: './e2e/teardown.js',
  testEnvironment: './e2e/puppeteer_environment.js',
  testRegex: '(/e2e.*\\.spec)\\.js',
  modulePathIgnorePatterns: [
    '<rootDir>/unit/partials/mock-store/.*/package.json',
    '<rootDir>/functional/store/.*/package.json',
    '<rootDir>/unit/partials/store/.*/package.json',
    '<rootDir>/../coverage',
    '<rootDir>/../docs',
    '<rootDir>/../debug',
    '<rootDir>/../scripts',
    '<rootDir>/../.circleci',
    '<rootDir>/../tools',
    '<rootDir>/../wiki',
    '<rootDir>/../systemd',
    '<rootDir>/../flow-typed',
    '<rootDir>unit/partials/mock-store/.*/package.json',
    '<rootDir>functional/store/.*/package.json',
    '<rootDir>/../build',
    '<rootDir>/../.vscode/',
  ],
};
