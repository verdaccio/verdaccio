const config = require('../../../../jest/config');

module.exports = Object.assign({}, config, {
  automock: false,
  collectCoverage: false,
  testEnvironment: 'jest-environment-jsdom-global',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testEnvironmentOptions: {
    url: 'http://localhost:9000/',
  },
  rootDir: '..',
  setupFilesAfterEnv: ['<rootDir>/jest/setup-env.ts'],
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
    '\\.(jpg)$': '<rootDir>/jest/unit/empty.ts',
    '\\.(md)$': '<rootDir>/jest/unit/empty-string.ts',
    'github-markdown-css': '<rootDir>/jest/identity.js',
    // note: this section has to be on sync with webpack configuration
    'verdaccio-ui/components/(.*)': '<rootDir>/src/components/$1',
    'verdaccio-ui/utils/(.*)': '<rootDir>/src/utils/$1',
    'react-markdown': '<rootDir>/src/__mocks__/react-markdown.tsx',
    'remark-*': '<rootDir>/src/__mocks__/remark-plugin.ts',
  },
});
