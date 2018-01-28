const config = {
  storage: __dirname + '/store/test-storage',
  uplinks: {
    'npmjs': {
      'url': 'https://registry.npmjs.org/'
    }
  },
  packages: {
    '@*/*': {
      allow_access: '$all',
      allow_publish: '$all',
      proxy: 'npmjs'
    },

    'forbidden-place': {
      allow_access: 'nobody',
      allow_publish: 'nobody'
    },

    'jquery': {
      allow_access: '$all',
      allow_publish: '$all',
      proxy: 'npmjs'
    },
    '*': {
      allow_access: '$all',
      allow_publish: '$all'
    },
  },
  logs: [
    {type: 'stdout', format: 'pretty', level: 'fatal'},
  ],
};

module.exports = config;
