import React from 'react';

import { default as Dependencies } from '.';

export default {
  title: 'Dependencies  ',
};

export const DeprecatedAll: any = () => (
  <Dependencies
    packageMeta={{
      latest: {
        name: 'verdaccio',
        version: '4.0.0',
        author: {
          name: 'verdaccio user',
          email: 'verdaccio.user@verdaccio.org',
          url: '',
          avatar: 'https://www.gravatar.com/avatar/000000',
        },
        dist: { fileCount: 0, unpackedSize: 0 },
        dependencies: {
          react: '16.9.0',
          'react-dom': '16.9.0',
        },
        devDependencies: {
          'babel-core': '7.0.0-beta6',
        },
        peerDependencies: {
          'styled-components': '5.0.0',
        },
      },
      _uplinks: {},
    }}
  />
);

export const NoDependencies: any = () => (
  <Dependencies
    packageMeta={{
      latest: {
        name: 'verdaccio',
        version: '4.0.0',
        author: {
          name: 'verdaccio user',
          email: 'verdaccio.user@verdaccio.org',
          url: '',
          avatar: 'https://www.gravatar.com/avatar/000000',
        },
        dist: { fileCount: 0, unpackedSize: 0 },
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      },
      _uplinks: {},
    }}
  />
);
