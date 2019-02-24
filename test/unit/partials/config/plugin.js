
import path from 'path';
import config from './index';

module.exports = {
  ...config(),
  auth: {
    [`${path.join(__dirname, '../plugin/authenticate')}`]: { }
  }
};
