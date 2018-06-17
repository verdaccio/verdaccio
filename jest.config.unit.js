/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-unit-jest',
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'fixtures'
  ],
  testEnvironment: 'jest-environment-jsdom-global',
  testRegex: '(test/unit.*\\.spec|test/unit/webui/.*\\.spec)\\.js',
  setupFiles: [
    './test/unit/setup.js'
  ],
  modulePathIgnorePatterns: [
    'setup.js'
  ],
  testPathIgnorePatterns: [
    '__snapshots__'
  ],
  moduleNameMapper: {
    '\\.(scss)$': '<rootDir>/node_modules/identity-obj-proxy',
    'github-markdown-css': '<rootDir>/node_modules/identity-obj-proxy',
    '\\.(png)$': '<rootDir>/node_modules/identity-obj-proxy'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!react-syntax-highlighter)'
  ]
};
