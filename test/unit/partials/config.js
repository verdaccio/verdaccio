'use strict';

const config = {
  storage: __dirname + '/store/test-storage',
  uplinks: {
    'npmjs': {
      'url': 'https://registry.npmjs.org/'
    }
  },
  packages: {
    '*': {
      allow_access: '$all',
    },
  },
  logger: {
    level: 'silent'
  }
};

module.exports = config;
