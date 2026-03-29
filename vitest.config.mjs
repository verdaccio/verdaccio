// @ts-check
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/build/**', 'scripts/**'],
    server: {
      deps: {
        // Pre-transform @verdaccio/* deps for ESM interop
        inline: [/@verdaccio\//],
      },
    },
    coverage: {
      reporter: ['text', 'html'],
      include: ['src'],
      exclude: ['./build', 'test', 'src/api/debug'],
    },
  },
});
