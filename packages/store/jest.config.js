const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  // FIXME: coverage fails here
  collectCoverage: true
});

