import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import type { TemplateUIOptions } from '@verdaccio/types';

import { AppConfigurationProvider } from '../../../providers';
import RegistryInfoContent from './RegistryInfoContent';

const REGISTRY_URL = 'http://localhost:4873/';

const meta: Meta<typeof RegistryInfoContent> = {
  title: 'Sections/Header/Registry information',
  component: RegistryInfoContent,
};

export default meta;
type Story = StoryObj<typeof RegistryInfoContent>;

const withConfig = (config: Partial<TemplateUIOptions>, scope?: string) => () => (
  <AppConfigurationProvider overrideConfig={config}>
    <RegistryInfoContent registryUrl={REGISTRY_URL} scope={scope} />
  </AppConfigurationProvider>
);

export const AllManagers: Story = {
  name: 'All package managers (with bun and minimum release age)',
  render: withConfig({ pkgManagers: ['npm', 'yarn', 'pnpm', 'bun'] }),
};

export const ScopedRegistry: Story = {
  name: 'Registry for one scope (web.scope)',
  render: withConfig(
    { pkgManagers: ['npm', 'yarn', 'pnpm', 'bun'], scope: '@verdaccio' },
    '@verdaccio'
  ),
};

export const NpmOnly: Story = {
  name: 'Only npm configured',
  render: withConfig({ pkgManagers: ['npm'] }),
};
