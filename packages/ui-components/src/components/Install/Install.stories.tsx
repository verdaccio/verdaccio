import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { default as Install } from '.';
import { useConfig } from '../../';

const meta: Meta<typeof Install> = {
  title: 'Components/Sidebar/Install',
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

export const allManagers: Story = {
  name: 'All package managers (with bun)',
  render: () => {
    const { configOptions } = useConfig();
    return (
      <Install
        configOptions={{
          ...configOptions,
          base: 'http://localhost:4873/',
          pkgManagers: ['npm', 'yarn', 'pnpm', 'bun'],
        }}
        packageMeta={packageMeta}
        packageName="jquery"
      />
    );
  },
};

export const bunOnly: Story = {
  name: 'Only bun',
  render: () => {
    const { configOptions } = useConfig();
    return (
      <Install
        configOptions={{
          ...configOptions,
          base: 'http://localhost:4873/',
          pkgManagers: ['bun'],
        }}
        packageMeta={packageMeta}
        packageName="jquery"
      />
    );
  },
};

export const scopedPackage: Story = {
  name: 'Scoped package (.npmrc for the scope)',
  render: () => {
    const { configOptions } = useConfig();
    return (
      <Install
        configOptions={{
          ...configOptions,
          base: 'http://localhost:4873/',
          pkgManagers: ['npm', 'pnpm', 'yarn'],
        }}
        packageMeta={{ ...packageMeta, latest: { ...packageMeta.latest, version: '8.0.0' } }}
        packageName="@verdaccio/core"
      />
    );
  },
};
