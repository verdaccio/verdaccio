const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  coverageThreshold: {
    global: {
      // FIXME: increase to 90
      branches: 55,
      functions: 81,
      lines: 71,
    },
  },
});
