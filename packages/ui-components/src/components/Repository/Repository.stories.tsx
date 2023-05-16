import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { default as Repository } from '.';

const meta: Meta<typeof Repository> = {
  title: 'Repository',
  component: Repository,
};
export default meta;
type Story = StoryObj<typeof Repository>;

export const Primary: Story = {
  name: 'Git Repository',
  render: () => {
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
  },
};

export const HTTPS: Story = {
  name: 'Https repo',
  render: () => (
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
  ),
};

export const HTTP: Story = {
  name: 'Http repo',
  render: () => (
    <Repository
      packageMeta={{
        _uplinks: {},
        latest: {
          name: 'verdaccio-ui/local-storage',
          version: '8.0.1-next.1',
          repository: {
            type: 'http',
            url: 'http://github.com/verdaccio/ui.git',
          },
        },
      }}
    />
  ),
};
