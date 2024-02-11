module.exports = {
  moduleFileExtensions: ['ts', 'js'],
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
