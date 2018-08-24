
import path from 'path';

const config = {
  storage: path.join(__dirname, '../store/test-storage-urlbase'),
  uplinks: {
    'npmjs': {
      'url': 'http://localhost:4873/'
    }
  },
  packages: {
    '@*/*': {
      access: '$all',
      publish: '$all',
      proxy: 'npmjs'
    },

    'forbidden-place': {
      access: 'nobody',
      publish: '$all'
    },

    'react': {
      access: '$all',
      publish: '$all',
      proxy: 'npmjs'
    },

    'corrupted-package': {
      access: '$all',
      publish: '$all',
      proxy: 'npmjs'
    },

    'jquery': {
      access: '$all',
      publish: '$all',
      proxy: 'npmjs'
    },
    'auth-package': {
      access: '$authenticated',
      publish: '$authenticated'
    },
    'vue': {
      access: '$authenticated',
      publish: '$authenticated',
      proxy: 'npmjs'
    },
    '*': {
      access: '$all',
      publish: '$all'
    },
  },
  logs: [
    {type: 'stdout', format: 'pretty', level: 'warn'},
  ],
};

module.exports = config;
