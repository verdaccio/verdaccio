/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-functional-jest',
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  globalSetup: './functional/pre-setup.js',
  globalTeardown: './functional/teardown.js',
  testEnvironment: './functional/test-environment.js',
  // Some unit tests rely on data folders that look like packages.  This confuses jest-hast-map
  // when it tries to scan for package.json files.
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
  collectCoverage: false
};
