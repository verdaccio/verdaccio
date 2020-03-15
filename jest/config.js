module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  verbose: false,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!**/node_modules/**",
    "!**/partials/**",
    "!**/fixture/**",
  ],
  coveragePathIgnorePatterns: ['node_modules', 'fixtures'],
};
