import React from 'react';

import { default as Repository } from '.';

export default {
  title: 'Repository',
};

export const RepositoryGit: any = () => {
  return (
    <Repository
      packageMeta={{
        _uplinks: {},
        latest: {
          name: 'verdaccio-ui/local-storage',
          version: '8.0.1-next.1',
          repository: {
            type: 'git',
            url: 'git://github.com/verdaccio/ui.git',
          },
        },
      }}
    />
  );
};

export const RepositoryHTTPS: any = () => {
  return (
    <Repository
      packageMeta={{
        _uplinks: {},
        latest: {
          name: 'verdaccio-ui/local-storage',
          version: '8.0.1-next.1',
          repository: {
            type: 'https',
            url: 'https://github.com/verdaccio/ui.git',
          },
        },
      }}
    />
  );
};
