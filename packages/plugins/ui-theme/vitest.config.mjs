import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { markdownRawPlugin, svgInlinePlugin } from './tools/vite-plugins.mjs';

export default defineConfig({
  plugins: [svgInlinePlugin(), markdownRawPlugin(), react()],

  define: {
    __DEBUG__: JSON.stringify(false),
    __APP_VERSION__: JSON.stringify('0.0.0-test'),
  },

  resolve: {
    alias: {
      'verdaccio-ui/components': path.resolve(import.meta.dirname, './src/components'),
      'verdaccio-ui/utils': path.resolve(import.meta.dirname, './src/utils'),
      'verdaccio-ui/providers': path.resolve(import.meta.dirname, './src/providers'),
      // Swap @verdaccio/ui-i18n for a Vite-native loader that uses import.meta.glob
      // instead of the CJS require()-based implementation in the published package.
      '@verdaccio/ui-i18n': path.resolve(import.meta.dirname, './src/i18n/loadTranslationFile.ts'),
      // react-markdown v9 is ESM-only, mock it for Node.js 18 compatibility
      'react-markdown': path.resolve(import.meta.dirname, './vitest/react-markdown-mock.js'),
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest/setup.ts'],
    exclude: ['node_modules', './build/'],
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
  },
});
