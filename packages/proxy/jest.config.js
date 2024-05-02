const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  coverageThreshold: {
    global: {
      branches: 79,
      functions: 90,
      lines: 86,
      statements: 86,
    },
  },
});
