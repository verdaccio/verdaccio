// @ts-check
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: ['./build', 'test', '**stories.*'],
    },
    globals: true,
  },
});
