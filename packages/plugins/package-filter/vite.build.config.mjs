// @ts-check
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['cjs'],
      fileName: () => 'index.js',
    },
    outDir: 'build',
    rollupOptions: {
      external: [/^@verdaccio\//, 'debug', 'semver'],
    },
    sourcemap: true,
    minify: false,
  },
});
