import { builtinModules } from 'node:module';
import path from 'node:path';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

const nodeBuiltins = new Set([
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]);

// search-indexer bundles all dependencies (like the previous esbuild config)
export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: path.resolve(import.meta.dirname, 'tsconfig.build.json'),
    }),
  ],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
    },
    rollupOptions: {
      external: (id) => nodeBuiltins.has(id),
      output: [
        { format: 'es', entryFileNames: 'dist.mjs' },
        { format: 'cjs', entryFileNames: 'dist.js' },
      ],
    },
  },
});
