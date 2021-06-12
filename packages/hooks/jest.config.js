const config = require('../../jest/config');

module.exports = Object.assign({}, config, {
  testEnvironment: 'node',
});
