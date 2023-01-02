import React from 'react';

import { default as Install } from '.';
import { useConfig } from '../../';

export default {
  title: 'Install  ',
};

export const ActionBarAll: any = () => {
  const { configOptions } = useConfig();
  return (
    <Install
      configOptions={{ ...configOptions, pkgManagers: ['npm', 'yarn', 'pnpm'] }}
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
      packageName="jquery"
    />
  );
};
