import React from 'react';

import { default as Uplinks } from '.';

export default {
  title: 'Components/Detail/Uplinks',
};

export const UplinksAll: any = () => {
  return (
    <Uplinks
      packageMeta={{
        latest: {
          name: 'verdaccio',
          version: '4.0.0',
        },
        _uplinks: {
          npmjs: {
            etag: '"W/"252f0a131cedd3ea82dfefd6fa049558""',
            fetched: 1529779934081,
          },
          yarn: {
            etag: '"W/"252f0a131cedd3ea82dfefd6fa049558""',
            fetched: 1529779934081,
          },
          private: {
            etag: '"W/"252f0a131cedd3ea82dfefd6fa049558""',
            fetched: 1529779934081,
          },
        },
      }}
    />
  );
};
export const NoUplinks: any = () => {
  return (
    <Uplinks
      packageMeta={{
        latest: {
          name: 'verdaccio',
          version: '4.0.0',
        },
        _uplinks: {},
      }}
    />
  );
};
