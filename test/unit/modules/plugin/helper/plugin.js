
import path from 'path';
import config from '../../../partials/config';

export const authProfileConf = config({
  auth: {
    [`${path.join(__dirname, '../../../partials/plugin/authenticate.success')}`]: { }
  }
});

export const authPluginFailureConf = config({
  auth: {
    [`${path.join(__dirname, '../../../partials/plugin/authenticate.fail')}`]: { }
  }
});

export const authPluginPassThrougConf = config({
  auth: {
    [`${path.join(__dirname, '../../../partials/plugin/authenticate.passthroug')}`]: { }
  }
});
