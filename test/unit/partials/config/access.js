import path from 'path';
import {DEFAULT_REGISTRY} from '../../../../src/lib/constants';

const config = {
  storage: path.join(__dirname, '../store/access-storage'),
  uplinks: {
    'npmjs': {
      'url': DEFAULT_REGISTRY
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
