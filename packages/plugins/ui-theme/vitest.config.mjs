import react from '@vitejs/plugin-react';
import path from 'node:path';
import markdown from 'vite-plugin-markdown';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest/setup.ts'],
    exclude: ['node_modules', './build/'],
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
    assetsInclude: ['**/*.md'],
    alias: {
      // https://github.com/vitest-dev/vitest/issues/5664#issuecomment-2093986338
      '@emotion/react': path.resolve('node_modules/@emotion/react/dist/emotion-react.cjs.mjs'),
    },
  },
  plugins: [
    markdown(),
    react({
      babel: {
        plugins: ['@emotion'],
      },
    }),
  ],
  resolve: {
    alias: {
      'verdaccio-ui/utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
