'use strict';

const config = {
  storage: __dirname + '/test-storage',
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
  logs: [
    {type: 'stdout', format: 'pretty', level: 'fatal'},
  ],
};

module.exports = config;
