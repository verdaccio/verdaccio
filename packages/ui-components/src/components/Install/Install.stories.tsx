/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { default as Install } from '.';
import { useConfig } from '../../';

const meta: Meta<typeof Install> = {
  title: 'Install',
  component: Install,
};

export default meta;
type Story = StoryObj<typeof Install>;

const packageMeta = {
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
};

export const Primary: Story = {
  name: 'Default',
  render: () => {
    const { configOptions } = useConfig();
    return (
      <Install
        configOptions={{ ...configOptions, pkgManagers: ['npm', 'yarn', 'pnpm'] }}
        packageMeta={packageMeta}
        packageName="jquery"
      />
    );
  },
};

export const npmOnly: Story = {
  name: 'Only NPM',
  render: () => {
    const { configOptions } = useConfig();
    return (
      <Install
        configOptions={{ ...configOptions, pkgManagers: ['npm'] }}
        packageMeta={packageMeta}
        packageName="jquery"
      />
    );
  },
};

export const yarnOnly: Story = {
  name: 'Only Yarn',
  render: () => {
    const { configOptions } = useConfig();
    return (
      <Install
        configOptions={{ ...configOptions, pkgManagers: ['yarn'] }}
        packageMeta={packageMeta}
        packageName="jquery"
      />
    );
  },
};

export const pnpmOnly: Story = {
  name: 'Only Pnpm',
  render: () => {
    const { configOptions } = useConfig();
    return (
      <Install
        configOptions={{ ...configOptions, pkgManagers: ['pnpm'] }}
        packageMeta={packageMeta}
        packageName="jquery"
      />
    );
  },
};
