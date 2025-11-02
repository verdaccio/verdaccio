import react from '@vitejs/plugin-react';
import path from 'node:path';
import { plugin as markdown } from 'vite-plugin-markdown';
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
    alias: {
      // https://github.com/vitest-dev/vitest/issues/5664#issuecomment-2093986338
      '@emotion/react': path.resolve('node_modules/@emotion/react/dist/emotion-react.cjs.mjs'),
      // react-markdown v9 is ESM-only, mock it for Node.js 18 compatibility
      'react-markdown': path.resolve(__dirname, './vitest/react-markdown-mock.js'),
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
      '@verdaccio/ui-components': path.resolve(__dirname, '../../../packages/ui-components/src/index.ts'),
      'react-markdown': path.resolve(__dirname, './vitest/react-markdown-mock.js'),
    },
  },
});
