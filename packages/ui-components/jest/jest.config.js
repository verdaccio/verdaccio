const config = require('../../../jest/config');

module.exports = Object.assign({}, config, {
  testEnvironment: 'jest-environment-jsdom-global',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testEnvironmentOptions: {
    url: 'http://localhost:9000/',
  },
  rootDir: '..',
  collectCoverage: true,
  setupFilesAfterEnv: ['<rootDir>/jest/setup-env.ts'],
  setupFiles: ['<rootDir>/jest/setup.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!react-syntax-highlighter)'],
  snapshotSerializers: ['@emotion/jest/serializer'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!src/**/*.stories.{ts,tsx}',
    '!src/types/**',
  ],
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  moduleNameMapper: {
    '\\.(s?css)$': '<rootDir>/jest/identity.js',
    '\\.(png)$': '<rootDir>/jest/identity.js',
    '\\.(svg)$': '<rootDir>/jest/unit/empty.ts',
    '\\.(jpg)$': '<rootDir>/jest/unit/empty.ts',
    '\\.(md)$': '<rootDir>/jest/unit/empty-string.ts',
    'react-markdown': '<rootDir>/src/__mocks__/react-markdown.tsx',
    'remark-*': '<rootDir>/src/__mocks__/remark-plugin.ts',
  },
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 81,
    },
  },
});
