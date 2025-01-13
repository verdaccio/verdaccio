import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-webpack5-compiler-babel',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  staticDirs: ['../public', '../storybook-static'],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
