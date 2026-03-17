// @ts-check
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        './build',
        'test',
        '**__partials__**',
        '**/node_modules/**',
        '**/storybook-static/**',
        '**/src/**/*.stories.{ts,tsx}',
      ],
    },
    globals: true,
  },
});
