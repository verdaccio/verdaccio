import config from '../../../jest/config.js';

export default Object.assign({}, config, {
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
});
