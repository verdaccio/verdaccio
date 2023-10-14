import type { Meta, StoryObj } from '@storybook/react';
import { clone, merge } from 'lodash';
import React from 'react';

import { default as ActionBar } from '.';

const meta: Meta<typeof ActionBar> = {
  title: 'Components/Sidebar/ActionBar',
  component: ActionBar,
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

const packageMeta = {
  _uplinks: {},
  latest: {
    name: 'verdaccio-ui/local-storage',
    version: '8.0.1-next.1',
    dist: {
      fileCount: 0,
      unpackedSize: 0,
      tarball: 'https://registry.npmjs.org/verdaccio/-/verdaccio-5.26.0.tgz',
    },
    homepage: 'https://verdaccio.org',
    bugs: {
      url: 'https://github.com/verdaccio/monorepo/issues',
    },
  },
};

export const Primary: Story = {
  name: 'Default',
  render: () => <ActionBar packageMeta={packageMeta} />,
};

export const Raw: Story = {
  name: 'Raw viewer',
  render: () => <ActionBar packageMeta={packageMeta} showRaw={true} />,
};

export const NoLatest: Story = {
  name: 'No latest (empty)',
  render: () => <ActionBar packageMeta={{}} showRaw={true} />,
};

export const Download: Story = {
  name: 'No show download',
  render: () => <ActionBar packageMeta={{ ...clone(packageMeta) }} showDownloadTarball={false} />,
};

export const Home: Story = {
  name: 'No home',
  render: () => (
    <ActionBar packageMeta={{ ...merge(clone(packageMeta), { latest: { homepage: null } }) }} />
  ),
};

export const Bugs: Story = {
  name: 'No bugs',
  render: () => (
    <ActionBar packageMeta={{ ...merge(clone(packageMeta), { latest: { bugs: null } }) }} />
  ),
};
