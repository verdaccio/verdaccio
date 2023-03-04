const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  coverageThreshold: {
    global: {
      branches: 79,
      functions: 94,
      lines: 87,
      statements: 87,
    },
  },
});
