import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest/setup.ts', './vitest/setup-env.ts'],
    exclude: ['node_modules', './build/'],
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
    snapshotSerializers: ['./vitest/vitestSerializer.ts'],
    alias: {
      // https://github.com/vitest-dev/vitest/issues/5664#issuecomment-2093986338
      '@emotion/react': path.resolve('node_modules/@emotion/react/dist/emotion-react.cjs.mjs'),
      '\\.(s?css)$': './vitest/identity.js',
      '\\.(png)$': './vitest/identity.js',
      '\\.(svg)$': './vitest/unit/empty.ts',
      '\\.(jpg)$': './vitest/unit/empty.ts',
      '\\.(md)$': './vitest/unit/empty-string.ts',
    },
    testTimeout: 10000,
  },
  plugins: [
    react({
      babel: {
        plugins: ['@emotion'],
      },
    }),
  ],
  resolve: {
    alias: {
      'verdaccio-ui/components': path.resolve(__dirname, './src/components'),
      'verdaccio-ui/utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
