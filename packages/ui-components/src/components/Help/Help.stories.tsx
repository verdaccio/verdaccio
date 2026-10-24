import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import type { TemplateUIOptions } from '@verdaccio/types';

import { default as Help } from '.';
import { AppConfigurationProvider } from '../../providers';

const REGISTRY_URL = 'http://localhost:4873/';

const withConfig = (config: Partial<TemplateUIOptions>) => () => (
  <AppConfigurationProvider overrideConfig={{ base: REGISTRY_URL, title: 'Verdaccio', ...config }}>
    <Help />
  </AppConfigurationProvider>
);

const meta: Meta<typeof Help> = {
  title: 'Components/Home/Help',
  component: Help,
};

export default meta;
type Story = StoryObj<typeof Help>;

export const Default: Story = {
  name: 'Empty registry',
  render: withConfig({ login: true, pkgManagers: ['npm', 'pnpm', 'yarn'] }),
};

export const ScopedRegistry: Story = {
  name: 'Registry for one scope (web.scope)',
  render: withConfig({ login: true, scope: '@verdaccio', pkgManagers: ['npm', 'pnpm', 'yarn'] }),
};

export const WithoutLogin: Story = {
  name: 'Web login disabled',
  render: withConfig({ login: false, pkgManagers: ['npm', 'pnpm', 'yarn'] }),
};

export const WithBun: Story = {
  name: 'With bun (web.pkgManagers)',
  render: withConfig({ login: true, pkgManagers: ['npm', 'pnpm', 'yarn', 'bun'] }),
};

export const CustomMarkdown: Story = {
  name: 'Replaced with markdown (web.help)',
  render: withConfig({
    help: [
      '## Verdaccio at the platform team',
      '',
      'This registry serves the `@verdaccio` packages and proxies npmjs.',
      '',
      '```',
      'npm config set registry {{registryUrl}}',
      '```',
      '',
      'Read the [registry guide](https://verdaccio.org/docs/cli-registry) before publishing.',
    ].join('\n'),
  }),
};

export const CustomMarkdownComplete: Story = {
  name: 'Replaced with markdown, full onboarding (web.help)',
  render: withConfig({
    scope: '@verdaccio',
    help: [
      '![Verdaccio](/dark-logo.png) **Verdaccio registry** for the `@verdaccio` packages',
      '',
      '## Before you start',
      '',
      '> Packages published here are private to the organisation. Public packages are proxied',
      '> from [npmjs](https://www.npmjs.com) and cached on first install.',
      '',
      '### 1. Point your client at the registry',
      '',
      'Add these lines to the `.npmrc` of the project, so CI uses the same registry:',
      '',
      '```ini',
      '@verdaccio:registry={{registryUrl}}',
      'registry={{registryUrl}}',
      '```',
      '',
      '### 2. Log in',
      '',
      '1. Ask the platform team for an account.',
      '2. Run `npm adduser --registry {{registryUrl}}`.',
      '3. Check it with `npm whoami --registry {{registryUrl}}`.',
      '',
      '### 3. Publish',
      '',
      '- Use the `@verdaccio` scope in the package name.',
      '- Keep `publishConfig` pointing here, so nothing leaks to npmjs:',
      '  ```json',
      '  { "publishConfig": { "registry": "{{registryUrl}}" } }',
      '  ```',
      '- Then run `npm publish`.',
      '',
      '---',
      '',
      'Questions? Read the [registry guide](https://verdaccio.org/docs/cli-registry) or the',
      '[publishing guide](https://verdaccio.org/docs/cli-registry#publish-config).',
    ].join('\n'),
  }),
};

export const NpmOnly: Story = {
  name: 'Only npm configured',
  render: withConfig({ login: true, pkgManagers: ['npm'] }),
};

export const CustomTitle: Story = {
  name: 'Custom registry title',
  render: withConfig({ login: true, title: 'Internal npm registry' }),
};
