const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  coverageThreshold: {
    global: {
      lines: 67,
      functions: 70,
      branches: 55,
      statements: 67,
    },
  },
});
