import fs from 'node:fs';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };
import { markdownRawPlugin, svgInlinePlugin } from './tools/vite-plugins.mjs';

const { version, name, license } = pkg;

/**
 * Generates a manifest.json that maps entry names to their hashed output paths.
 * The Verdaccio server reads this manifest to know which JS/CSS files to inject
 * into the HTML response.
 */
function verdaccioManifestPlugin() {
  const staticPrefix = '-/static/';
  return {
    name: 'verdaccio-manifest',
    apply: 'build',
    buildStart() {
      // Emit favicon as a static asset so it lands in outDir
      const faviconPath = path.resolve(__dirname, './src/template/favicon.ico');
      if (fs.existsSync(faviconPath)) {
        this.emitFile({
          type: 'asset',
          fileName: 'favicon.ico',
          source: fs.readFileSync(faviconPath),
        });
      }
    },
    generateBundle(_, bundle) {
      const manifest = {};

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk') {
          if (chunk.isEntry) {
            manifest[`${chunk.name}.js`] = `${staticPrefix}${fileName}`;
          }
        } else if (chunk.type === 'asset') {
          if (fileName.endsWith('.css')) {
            const base = path.basename(fileName).replace(/\.[A-Za-z0-9_-]+\.css$/, '.css');
            manifest[base] = `${staticPrefix}${fileName}`;
          } else if (fileName === 'favicon.ico') {
            manifest['favicon.ico'] = `${staticPrefix}favicon.ico`;
          }
        }
      }

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(manifest, null, 2),
      });
    },
  };
}

const backendUrl = process.env.VERDACCIO_DEV_TARGET || 'http://localhost:8000';

export default defineConfig(({ command }) => ({
  // In build mode, all dynamic chunk imports must be prefixed with /-/static/
  // so Verdaccio's static file server can resolve them.
  // In dev mode, Vite serves everything from / directly.
  base: command === 'build' ? '/-/static/' : '/',

  define: {
    __DEBUG__: JSON.stringify(false),
    __APP_VERSION__: JSON.stringify(version),
  },

  plugins: [svgInlinePlugin(), markdownRawPlugin(), react(), verdaccioManifestPlugin()],

  resolve: {
    alias: {
      'verdaccio-ui/components': path.resolve(__dirname, './src/components'),
      'verdaccio-ui/utils': path.resolve(__dirname, './src/utils'),
      'verdaccio-ui/providers': path.resolve(__dirname, './src/providers'),
      // Swap @verdaccio/ui-i18n for a Vite-native loader that uses import.meta.glob
      // instead of the CJS require()-based implementation in the published package.
      '@verdaccio/ui-i18n': path.resolve(__dirname, './src/i18n/loadTranslationFile.ts'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 4873,
    proxy: {
      '/-/verdaccio': { target: backendUrl, changeOrigin: true },
      '/-/v1': { target: backendUrl, changeOrigin: true },
      '/-/user': { target: backendUrl, changeOrigin: true },
      '**/*.tgz': { target: backendUrl, changeOrigin: true },
    },
  },

  build: {
    outDir: 'static',
    emptyOutDir: true,
    assetsDir: '',
    sourcemap: false,
    minify: true,
    rolldownOptions: {
      input: { main: path.resolve(__dirname, './src/index.tsx') },
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]',
        banner: `/*!\n  Name: [name]\n  Package: ${name}\n  Version: v${version}\n  License: ${license}\n  https://www.verdaccio.org\n*/`,
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendors';
          }
        },
      },
    },
  },
}));
