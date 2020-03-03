/* eslint comma-dangle: 0 */

module.exports = {
  name: 'verdaccio-unit-jest',
  verbose: true,
  collectCoverage: false,
  // reporters: ["default", ["jest-junit", { outputDirectory: 'reports' }]],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testRegex: '(test/unit.*\\.spec)\\.ts',
  // Some unit tests rely on data folders that look like packages.  This confuses jest-hast-map
  // when it tries to scan for package.json files.
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
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
    '<rootDir>/systemd',
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
  ]
};
