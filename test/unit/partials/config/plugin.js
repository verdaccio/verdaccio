
import path from 'path';

module.exports = {
  ...require('./index'),
  auth: {
    [`${path.join(__dirname, '../plugin/authenticate')}`]: { }
  }
};
