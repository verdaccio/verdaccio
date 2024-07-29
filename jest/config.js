module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  maxWorkers: 3,
  testTimeout: 20000,
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  verbose: false,
  collectCoverage: false,
  coverageReporters: ['text', 'html'],
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!**/partials/**', '!**/fixture/**'],
  coveragePathIgnorePatterns: ['node_modules', 'fixtures'],
  coverageThreshold: {
    global: {
      lines: 85,
    },
  },
};
