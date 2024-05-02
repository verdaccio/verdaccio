const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
});
