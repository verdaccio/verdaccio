import path from 'path';

const config = {
  storage: path.join(__dirname, '../store/access-storage'),
  uplinks: {
    'npmjs': {
      'url': 'https://registry.npmjs.org/'
    }
  },
  packages: {
    'jquery': {
      allow_access: '$all',
      allow_publish: '$all'
    },
    '**': {
      allow_access: '$all',
      allow_publish: '$all',
      proxy: 'npmjs'
    }
  },
  logs: [
    {type: 'stdout', format: 'pretty', level: 'fatal'},
  ],
};

module.exports = config;
