import type { StorybookConfig } from '@storybook/react-vite';
import react from '@vitejs/plugin-react';
import type { InlineConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  staticDirs: ['../public'],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  async viteFinal(config): Promise<InlineConfig> {
    // Resolve workspace packages via their TypeScript source ("source" export condition)
    // to avoid CJS/ESM issues with pre-built packages.
    config.resolve ??= {};
    config.resolve.conditions = ['source', ...(config.resolve.conditions ?? [])];

    // Replace the framework's default React plugin with one that includes the
    // Emotion Babel plugin, so component selectors (e.g. styled(Foo)) work correctly.
    config.plugins = (config.plugins ?? []).filter(
      (p) => p && 'name' in p && !String((p as { name: string }).name).startsWith('vite:react')
    );
    config.plugins.push(react());

    return config;
  },
};

export default config;
