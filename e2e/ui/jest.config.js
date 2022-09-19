const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  verbose: false,
  collectCoverage: false,
  globalSetup: './pre-setup.js',
  globalTeardown: './teardown.js',
});
