// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from '@storybook/react-webpack5';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-webpack5-compiler-babel'),
    getAbsolutePath('@storybook/addon-docs'),
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  staticDirs: ['../public'],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

export default config;
