const { defaults } = require('jest-config');
const config = require('../../../jest/config');

module.exports = Object.assign({}, config, {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
});
