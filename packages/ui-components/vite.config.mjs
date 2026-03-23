import fs from 'node:fs';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };

/**
 * Inlines SVG files as base64 data URIs.
 */
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

// Externalize all listed dependencies so they are not bundled.
const externalDeps = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
]);

export default defineConfig({
  plugins: [svgInlinePlugin(), react()],

  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
    },
    rolldownOptions: {
      external: (id) =>
        externalDeps.has(id) || [...externalDeps].some((dep) => id.startsWith(`${dep}/`)),
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].mjs',
        },
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
        },
      ],
    },
  },
});
