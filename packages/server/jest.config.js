const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  setupFilesAfterEnv: ['./jest.setup.js'],
  // FIXME: coverage fails here
  collectCoverage: false
});

