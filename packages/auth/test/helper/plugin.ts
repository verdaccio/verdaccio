import path from 'path';

import { getDefaultConfig } from '@verdaccio/config';

export const authProfileConf = {
  ...getDefaultConfig(),
  auth: {
    [`${path.join(__dirname, '../partials/plugin/authenticate.success')}`]: {},
  },
};

export const authPluginFailureConf = {
  ...getDefaultConfig(),
  auth: {
    [`${path.join(__dirname, '../partials/plugin/authenticate.fail.js')}`]: {},
  },
};

export const authPluginPassThrougConf = {
  ...getDefaultConfig(),
  auth: {
    [`${path.join(__dirname, '../partials/plugin/authenticate.passthroug')}`]: {},
  },
};
