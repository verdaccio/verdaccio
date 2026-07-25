import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import { createLibConfig } from '../../../vite.lib.config.mjs';

export default mergeConfig(
  createLibConfig(import.meta.dirname, { outDir: 'lib' }),
  defineConfig({
    test: {
      include: ['test/**/*.spec.ts'],
      globals: false,
    },
  })
);
