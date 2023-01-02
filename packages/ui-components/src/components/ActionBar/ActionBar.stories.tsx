import React from 'react';

import { default as ActionBar } from '.';

export default {
  title: 'ActionBar  ',
};

export const ActionBarAll: any = () => (
  <ActionBar
    packageMeta={{
      _uplinks: {},
      latest: {
        name: 'verdaccio-ui/local-storage',
        version: '8.0.1-next.1',
        dist: {
          fileCount: 0,
          unpackedSize: 0,
          tarball: 'http://localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz',
        },
        homepage: 'https://verdaccio.org',
        bugs: {
          url: 'https://github.com/verdaccio/monorepo/issues',
        },
      },
    }}
  />
);

export const RawViewer: any = () => (
  <ActionBar
    packageMeta={{
      _uplinks: {},
      latest: {
        name: 'verdaccio-ui/local-storage',
        version: '8.0.1-next.1',
        dist: {
          fileCount: 0,
          unpackedSize: 0,
          tarball: 'http://localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz',
        },
        homepage: 'https://verdaccio.org',
        bugs: {
          url: 'https://github.com/verdaccio/monorepo/issues',
        },
      },
    }}
    showRaw={true}
  />
);
