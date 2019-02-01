/**
 * @prettier
 * @flow
 */

const path = require('path');

const APP_ROOT = path.resolve(__dirname, '../../');

module.exports = {
  APP_ROOT,
  SRC_ROOT: path.resolve(APP_ROOT, 'src/'),
};
