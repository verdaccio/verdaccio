import fs from 'node:fs';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

function svgInlinePlugin() {
  return {
    name: 'svg-inline',
    enforce: 'pre',
    load(id) {
      if (!id.endsWith('.svg')) return;
      const svg = fs.readFileSync(id);
      const base64 = svg.toString('base64');
      return { code: `export default "data:image/svg+xml;base64,${base64}"`, map: null };
    },
  };
}

function markdownRawPlugin() {
  return {
    name: 'markdown-raw',
    transform(code, id) {
      if (id.endsWith('.md')) {
        return { code: `export default ${JSON.stringify(code)}`, map: null };
      }
    },
  };
}

export default defineConfig({
  plugins: [svgInlinePlugin(), markdownRawPlugin(), react()],

  define: {
    __DEBUG__: JSON.stringify(false),
    __APP_VERSION__: JSON.stringify('0.0.0-test'),
  },

  resolve: {
    alias: {
      'verdaccio-ui/components': path.resolve(__dirname, './src/components'),
      'verdaccio-ui/utils': path.resolve(__dirname, './src/utils'),
      'verdaccio-ui/providers': path.resolve(__dirname, './src/providers'),
      '@verdaccio/ui-i18n': path.resolve(__dirname, './src/i18n/loadTranslationFile.ts'),
      // react-markdown v9 is ESM-only, mock it for Node.js 18 compatibility
      'react-markdown': path.resolve(__dirname, './vitest/react-markdown-mock.js'),
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
