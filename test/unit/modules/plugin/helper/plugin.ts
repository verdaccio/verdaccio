import path from 'path';

import config from '../../../partials/config';

export const authProfileConf = config({
  auth: {
    success: {},
  },
  plugins: path.join(__dirname, '../../../partials/plugin'),
});

export const authPluginFailureConf = config({
  auth: {
    failure: {},
  },
  plugins: path.join(__dirname, '../../../partials/plugin'),
});

export const authPluginPassThrougConf = config({
  auth: {
    passthroug: {},
  },
  plugins: path.join(__dirname, '../../../partials/plugin'),
});
