/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-unit-jest',
  verbose: true,
  collectCoverage: true,
  testEnvironment: 'jest-environment-jsdom-global',
  testURL: 'http://localhost',
  testRegex: '(test/unit.*\\.spec|test/unit/webui/.*\\.spec)\\.js',
  setupFiles: [
    './test/unit/setup.js'
  ],
   // Some unit tests rely on data folders that look like packages.  This confuses jest-hast-map
   // when it tries to scan for package.json files.
  modulePathIgnorePatterns: [
    '<rootDir>/test/unit/partials/mock-store/.*/package.json',
    '<rootDir>/test/functional/store/.*/package.json',
    '<rootDir>/test/unit/partials/store/.*/package.json',
    '<rootDir>/coverage',
    '<rootDir>/docs',
    '<rootDir>/debug',
    '<rootDir>/scripts',
    '<rootDir>/.circleci',
    '<rootDir>/tools',
    '<rootDir>/wiki',
    '<rootDir>/systemd',
    '<rootDir>/flow-typed',
    '<rootDir>test/unit/partials/mock-store/.*/package.json',
    '<rootDir>/test/functional/store/.*/package.json',
    '<rootDir>/build',
    '<rootDir>/.vscode/',
  ],
  testPathIgnorePatterns: [
    '__snapshots__',
    '<rootDir>/build',
  ],
  coveragePathIgnorePatterns: [
    'node_modules',
    'fixtures',
    '<rootDir>/src/api/debug',
    '<rootDir>/test',
  ],
  moduleNameMapper: {
    '\\.(s?css)$': '<rootDir>/node_modules/identity-obj-proxy',
    'github-markdown-css': '<rootDir>/node_modules/identity-obj-proxy',
    '\\.(png)$': '<rootDir>/node_modules/identity-obj-proxy',
    '\\.(svg)$': '<rootDir>/test/unit/empty.js'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!react-syntax-highlighter)'
  ]
};
