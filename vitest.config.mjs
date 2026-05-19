// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const setupFile = fileURLToPath(new URL('./vitest.setup.mjs', import.meta.url));

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
    setupFiles: [setupFile],
  },
});
