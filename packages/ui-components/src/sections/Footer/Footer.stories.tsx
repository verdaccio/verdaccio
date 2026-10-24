import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { AppConfigurationProvider } from '../../providers';
import Footer from './Footer';

type FooterArgs = { footer?: string; poweredBy?: boolean | string };

const meta: Meta<FooterArgs> = {
  title: 'Sections/Footer',
  argTypes: {
    footer: { control: 'text', description: 'web.footer (markdown)' },
    poweredBy: {
      control: 'text',
      description: 'web.poweredBy: false hides it, markdown replaces it',
    },
  },
  render: ({ footer, poweredBy }) => (
    <AppConfigurationProvider overrideConfig={{ footer, poweredBy, version: '9.0.0' }}>
      <Footer />
    </AppConfigurationProvider>
  ),
};

export default meta;
type Story = StoryObj<FooterArgs>;

export const Default: Story = {
  name: 'Default message',
  args: { footer: undefined },
};

export const Text: Story = {
  name: 'Custom text',
  args: { footer: 'Internal npm registry, maintained by the platform team' },
};

export const Links: Story = {
  name: 'Text with links',
  args: {
    footer:
      'Need help? Read the [registry guide](https://verdaccio.org/docs/cli-registry) · [Report an issue](https://github.com/verdaccio/verdaccio/issues)',
  },
};

export const Image: Story = {
  name: 'Image',
  args: { footer: '![Verdaccio](/dark-logo.png)' },
};

export const ImageAndText: Story = {
  name: 'Image, text and link',
  args: {
    footer:
      '![Verdaccio](/dark-logo.png) Hosted with Verdaccio · [Status page](https://verdaccio.org/docs/what-is-verdaccio)',
  },
};

export const WithoutPoweredBy: Story = {
  name: 'Powered by hidden (poweredBy: false)',
  args: { footer: 'Internal npm registry, maintained by the platform team', poweredBy: false },
};

export const PoweredByText: Story = {
  name: 'Powered by replaced with text and a link',
  args: {
    footer: 'Internal npm registry',
    poweredBy: 'Run by the platform team · [Contact](https://verdaccio.org/docs/what-is-verdaccio)',
  },
};

export const PoweredByImage: Story = {
  name: 'Powered by replaced with an image link',
  args: {
    footer: 'Need help? Read the [registry guide](https://verdaccio.org/docs/cli-registry)',
    poweredBy: '[![Verdaccio](/dark-logo.png)](https://verdaccio.org)',
  },
};
