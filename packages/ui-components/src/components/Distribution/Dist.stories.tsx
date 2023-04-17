import React from 'react';

import { default as Dist } from '.';

export default {
  title: 'Dist',
};

export const AllProperties: any = () => (
  <Dist
    packageMeta={{
      latest: {
        name: 'verdaccio1',
        version: '4.0.0',
        dist: {
          fileCount: 7,
          unpackedSize: 10,
        },
        license: 'MIT',
      },
      _uplinks: {},
    }}
  />
);

export const NoFileSize: any = () => (
  <Dist
    packageMeta={{
      latest: {
        name: 'verdaccio1',
        version: '4.0.0',
        dist: {
          // @ts-ignore
          fileCount: undefined,
          unpackedSize: 10,
        },
        license: 'MIT',
      },
      _uplinks: {},
    }}
  />
);

export const OnlyLicense: any = () => (
  <Dist
    packageMeta={{
      latest: {
        name: 'verdaccio1',
        version: '4.0.0',
        license: { type: 'MIT' },
      },
      _uplinks: {},
    }}
  />
);

export const NoRender: any = () => (
  <Dist
    packageMeta={{
      latest: {
        name: 'verdaccio1',
        version: '4.0.0',
      },
      _uplinks: {},
    }}
  />
);
