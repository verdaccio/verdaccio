import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { default as Dependencies } from '.';

const meta: Meta<typeof Dependencies> = {
  title: 'Components/Detail/Dependencies',
  component: Dependencies,
};

export default meta;
type Story = StoryObj<typeof Dependencies>;

const packageMeta = {
  latest: {
    name: 'verdaccio',
    version: '4.0.0',
    author: {
      name: 'verdaccio user',
      email: 'verdaccio.user@verdaccio.org',
      url: '',
      avatar: 'https://www.gravatar.com/avatar/000000',
    },
    dist: { fileCount: 0, unpackedSize: 0 },
    dependencies: {
      react: '16.9.0',
      'react-dom': '16.9.0',
      '@storybook/codemod': '^3.2.6',
      chalk: '^2.1.0',
      'child-process-promise': '^2.2.1',
      commander: '^2.11.0',
      'cross-spawn': '^5.0.1',
      jscodeshift: '^0.3.30',
      json5: '^0.5.1',
      'latest-version': '^3.1.0',
      'merge-dirs': '^0.2.1',
      opencollective: '^1.0.3',
      shelljs: '^0.7.8',
      'update-notifier': '^2.1.0',
    },
    devDependencies: {
      'babel-core': '7.0.0-beta6',
      'cross-spawn': '^5.0.1',
      jscodeshift: '^0.3.30',
      json5: '^0.5.1',
      'latest-version': '^3.1.0',
      'merge-dirs': '^0.2.1',
      opencollective: '^1.0.3',
      shelljs: '^0.7.8',
      'update-notifier': '^2.1.0',
    },
    peerDependencies: {
      'styled-components': '5.0.0',
      'cross-spawn': '^5.0.1',
      jscodeshift: '^0.3.30',
      json5: '^0.5.1',
      'latest-version': '^3.1.0',
      'merge-dirs': '^0.2.1',
      opencollective: '^1.0.3',
      shelljs: '^0.7.8',
      'update-notifier': '^2.1.0',
    },
    optionalDependencies: {
      'styled-components': '5.0.0',
      'cross-spawn': '^5.0.1',
      jscodeshift: '^0.3.30',
      json5: '^0.5.1',
      'latest-version': '^3.1.0',
      'merge-dirs': '^0.2.1',
      opencollective: '^1.0.3',
      shelljs: '^0.7.8',
      'update-notifier': '^2.1.0',
    },
    bundleDependencies: {
      'styled-components': '5.0.0',
      'cross-spawn': '^5.0.1',
      jscodeshift: '^0.3.30',
      json5: '^0.5.1',
      'latest-version': '^3.1.0',
      'merge-dirs': '^0.2.1',
      opencollective: '^1.0.3',
      shelljs: '^0.7.8',
      'update-notifier': '^2.1.0',
    },
  },
  _uplinks: {},
};

export const Primary: Story = {
  name: 'Default',
  render: () => {
    return <Dependencies packageMeta={packageMeta} />;
  },
};

export const OnlyDeps: Story = {
  name: 'Only dependencies',
  render: () => {
    return (
      <Dependencies
        packageMeta={{
          latest: {
            name: 'verdaccio',
            version: '4.0.0',
            author: {
              name: 'verdaccio user',
              email: 'verdaccio.user@verdaccio.org',
              url: '',
              avatar: 'https://www.gravatar.com/avatar/000000',
            },
            dist: { fileCount: 0, unpackedSize: 0 },
            dependencies: {
              'styled-components': '5.0.0',
              'cross-spawn': '^5.0.1',
              jscodeshift: '^0.3.30',
              json5: '^0.5.1',
              'latest-version': '^3.1.0',
              'merge-dirs': '^0.2.1',
              opencollective: '^1.0.3',
              shelljs: '^0.7.8',
              'update-notifier': '^2.1.0',
            },
            devDependencies: { jscodeshift: '^0.3.30', json5: '^0.5.1' },
            peerDependencies: {},
          },
          _uplinks: {},
        }}
      />
    );
  },
};

export const NoDependencies: Story = {
  name: 'No dependencies',
  render: () => {
    return (
      <Dependencies
        packageMeta={{
          latest: {
            name: 'verdaccio',
            version: '4.0.0',
            author: {
              name: 'verdaccio user',
              email: 'verdaccio.user@verdaccio.org',
              url: '',
              avatar: 'https://www.gravatar.com/avatar/000000',
            },
            dist: { fileCount: 0, unpackedSize: 0 },
            dependencies: {},
            devDependencies: {},
            peerDependencies: {},
          },
          _uplinks: {},
        }}
      />
    );
  },
};
