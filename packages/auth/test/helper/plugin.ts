import path from 'path';

import { getDefaultConfig } from '@verdaccio/config';

export const authProfileConf = {
  ...getDefaultConfig(),
  plugins: path.join(__dirname, '../partials/plugin'),
  auth: {
    success: {},
  },
};

export const authChangePasswordConf = {
  ...getDefaultConfig(),
  plugins: path.join(__dirname, '../partials/plugin'),
  auth: {
    'change-password': {},
  },
};

export const authPluginFailureConf = {
  ...getDefaultConfig(),
  plugins: path.join(__dirname, '../partials/plugin'),
  auth: {
    fail: {},
  },
};

export const authPluginPassThrougConf = {
  ...getDefaultConfig(),
  plugins: path.join(__dirname, '../partials/plugin'),
  auth: {
    passthroug: {},
  },
};

export const authFailInvalidMethod = {
  ...getDefaultConfig(),
  plugins: path.join(__dirname, '../partials/plugin'),
  auth: {
    'fail-invalid-method': {},
  },
};
