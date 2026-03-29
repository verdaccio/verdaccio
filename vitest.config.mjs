// @ts-check
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/build/**', 'scripts/**'],
    server: {
      deps: {
        // Pre-transform CJS deps so named imports work in ESM context
        inline: [/lodash/, /@verdaccio\//],
      },
    },
    coverage: {
      reporter: ['text', 'html'],
      include: ['src'],
      exclude: ['./build', 'test', 'src/api/debug'],
    },
  },
});
