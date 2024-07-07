import React from 'react';

import { default as Keywords } from '.';

export default {
  title: 'Components/Sidebar/Keywords',
};

export const AllProperties: any = () => (
  <Keywords
    packageMeta={{
      latest: {
        name: 'verdaccio1',
        version: '4.0.0',
        keywords: ['verdaccio', 'npm', 'yarn'],
      },
    }}
  />
);
