import { resolve } from 'node:path';

import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import { createLibConfig } from '../../../vite.lib.config.mjs';

export default mergeConfig(
  createLibConfig(import.meta.dirname, { outDir: 'lib' }),
  defineConfig({
    resolve: {
      alias: {
        '@verdaccio/streams': resolve(import.meta.dirname, '../../core/streams/src/index.ts'),
        '@verdaccio/file-locking': resolve(
          import.meta.dirname,
          '../../core/file-locking/src/index.ts'
        ),
      },
    },
    test: {
      include: ['tests/**/*.test.ts'],
      globals: false,
      oxc: {
        tsconfig: {
          configFile: resolve(import.meta.dirname, 'tsconfig.json'),
        },
      },
    },
  })
);
