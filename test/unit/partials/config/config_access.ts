import path from 'path';

import { ROLES } from '@verdaccio/utils';

const config = {
  storage: path.join(__dirname, '../store/access-storage'),
  uplinks: {
    npmjs: {
      url: 'http://never_use:0000/',
    },
  },
  packages: {
    jquery: {
      allow_access: ROLES.$ALL,
      allow_publish: ROLES.$ALL,
    },
    '**': {
      allow_access: ROLES.$ALL,
      allow_publish: ROLES.$ALL,
      proxy: 'npmjs',
    },
  },
  log: { type: 'stdout', format: 'pretty', level: 'fatal' },
};

export default config;
