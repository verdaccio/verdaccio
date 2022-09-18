const { defaults } = require('jest-config');
const config = require('../../../jest/config');

module.exports = Object.assign({}, config, {
  collectCoverage: false,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
});
