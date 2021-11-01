const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 92,
      statements: 90,
    },
  },
});
