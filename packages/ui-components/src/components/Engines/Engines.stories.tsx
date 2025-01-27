import React from 'react';

import { default as Engines } from '.';

export default {
  title: 'Components/Sidebar/Engines',
};

export const EnginesAll: any = () => (
  <Engines
    packageMeta={{
      latest: {
        engines: {
          node: '>= 18',
          pnpm: '>7',
          yarn: '>3',
          npm: '>3',
        },
      },
    }}
  />
);

export const EnginesNpmNode: any = () => (
  <Engines
    packageMeta={{
      latest: {
        engines: {
          node: '>= 0.1.98',
          npm: '>3',
        },
      },
    }}
  />
);

export const EnginesNode: any = () => (
  <Engines
    packageMeta={{
      latest: {
        engines: {
          node: '>= 18',
        },
      },
    }}
  />
);

export const EnginesYarn: any = () => (
  <Engines
    packageMeta={{
      latest: {
        engines: {
          yarn: '>3',
        },
      },
    }}
  />
);

export const EnginesPnpm: any = () => (
  <Engines
    packageMeta={{
      latest: {
        engines: {
          pnpm: '>7',
        },
      },
    }}
  />
);
