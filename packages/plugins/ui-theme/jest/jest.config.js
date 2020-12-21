const config = require('../../../jest/config');

module.exports = Object.assign({}, config, {
  name: 'verdaccio-ui-jest',
  verbose: true,
  automock: false,
  collectCoverage: true,
  testEnvironment: 'jest-environment-jsdom-global',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testURL: 'http://localhost',
  rootDir: '..',
  setupFilesAfterEnv: ['<rootDir>/jest/expect-setup.js'],
  setupFiles: ['<rootDir>/jest/setup.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!react-syntax-highlighter)'],
  modulePathIgnorePatterns: [
    '<rootDir>/coverage',
    '<rootDir>/scripts',
    '<rootDir>/.circleci',
    '<rootDir>/tools',
    '<rootDir>/build',
    '<rootDir>/.vscode/',
    '<rootDir>/test/e2e/',
  ],
  snapshotSerializers: ['@emotion/jest/serializer'],
  moduleNameMapper: {
    '\\.(s?css)$': '<rootDir>/jest/identity.js',
    '\\.(png)$': '<rootDir>/jest/identity.js',
    '\\.(svg)$': '<rootDir>/jest/unit/empty.ts',
    'github-markdown-css': '<rootDir>/jest/identity.js',
    // note: this section has to be on sync with webpack configuration
    'verdaccio-ui/components/(.*)': '<rootDir>/src/components/$1',
    'verdaccio-ui/utils/(.*)': '<rootDir>/src/utils/$1',
    'verdaccio-ui/design-tokens/(.*)': '<rootDir>/src/design-tokens/$1',
  },
});
