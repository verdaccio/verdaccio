const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  coverageThreshold: {
    global: {
      // FIXME: increase to 90
      branches: 51,
      functions: 69,
      lines: 66,
    },
  },
});
