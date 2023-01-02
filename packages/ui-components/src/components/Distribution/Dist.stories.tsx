import React from 'react';

import { default as Dist } from '.';

export default {
  title: 'Dist',
};

export const DistFileAll: any = () => (
  <Dist
    packageMeta={{
      latest: {
        name: 'verdaccio1',
        version: '4.0.0',
        dist: {
          fileCount: 7,
          unpackedSize: 10,
        },
        license: '',
      },
      _uplinks: {},
    }}
  />
);
