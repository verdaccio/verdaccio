import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.e2e.ts'],
    testTimeout: 60_000,
    globals: false,
  },
});
