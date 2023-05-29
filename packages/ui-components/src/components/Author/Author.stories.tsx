import React from 'react';

import { default as Author } from '.';

export default {
  title: 'Components/Sidebar/Author',
};

export const AuthorAll: any = () => (
  <Author
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

export const NoDAuthor: any = () => (
  <Author
    packageMeta={{
      latest: {
        name: 'verdaccio',
        version: '4.0.0',
        author: {},
        dist: { fileCount: 0, unpackedSize: 0 },
        dependencies: {},
        devDependencies: {},
        peerDependencies: {},
      },
      _uplinks: {},
    }}
  />
);
