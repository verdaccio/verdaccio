const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  coverageThreshold: {
    global: {
      // FIXME: increase to 90
      lines: 85,
    },
  },
});
