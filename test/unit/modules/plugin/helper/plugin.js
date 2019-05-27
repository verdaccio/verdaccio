
import path from 'path';
import config from '../../../partials/config';

const authProfileConf = {
  ...config(),
  auth: {
    [`${path.join(__dirname, '../../../partials/plugin/authenticate')}`]: { }
  }
};

export default authProfileConf;
