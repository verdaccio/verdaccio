const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  coverageThreshold: {
    global: {
      lines: 67,
      functions: 80,
      branches: 56,
      statements: 67,
    },
  },
});
