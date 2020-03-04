const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  collectCoverage: true,
  coveragePathIgnorePatterns: ['node_modules', 'fixtures'],
});
