// @ts-check
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'html'],
      include: ['src'],
      exclude: ['./build', 'test', 'src/api/debug'],
    },
  },
});
