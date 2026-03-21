// @ts-check
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['tests/fixtures/**'],
    },
    globals: true,
  },
});
