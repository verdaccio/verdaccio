// @ts-check
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        './build',
        'test',
        'tests',
        '**__partials__**',
        '**/node_modules/**',
        '**/storybook-static/**',
        '**/src/**/*.stories.{ts,tsx}',
        '**/build/_virtual/**',
      ],
    },
    globals: true,
  },
});
