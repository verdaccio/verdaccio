const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  setupFilesAfterEnv: ['./jest.setup.js']
});

