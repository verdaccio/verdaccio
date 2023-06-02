import React from 'react';

import { DeveloperType, default as Developers } from '.';

export default {
  title: 'Components/Sidebar/Developers',
};

export const DevelopersAll: any = () => (
  <Developers
    packageMeta={{
      latest: {
        packageName: 'foo',
        version: '1.0.0',
        contributors: [
          {
            name: 'dmethvin',
            email: 'test@gmail.com',
          },
          {
            name: 'dmethvin2',
            email: 'test2@gmail.com',
          },
          {
            name: 'dmethvin3',
            email: 'test3@gmail.com',
          },
        ],
      },
    }}
    type={DeveloperType.CONTRIBUTORS}
  />
);

export const DevelopersLimited: any = () => (
  <Developers
    packageMeta={{
      latest: {
        packageName: 'foo',
        version: '1.0.0',
        contributors: [
          {
            name: 'dmethvin',
            email: 'test@gmail.com',
          },
          {
            name: 'dmethvin2',
            email: 'test2@gmail.com',
          },
          {
            name: 'dmethvin3',
            email: 'test3@gmail.com',
          },
        ],
      },
    }}
    type={DeveloperType.CONTRIBUTORS}
    visibleMax={1}
  />
);
