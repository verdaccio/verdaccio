var config = {
  storage: __dirname + '/test-storage',
  packages: {
    '*': {
      allow_access: '$all',
    },
  },
  logs: [
    {type: 'stdout', format: 'pretty', level: 'fatal'}
  ],
}

module.exports = config;
