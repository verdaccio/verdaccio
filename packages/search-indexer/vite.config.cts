import { builtinModules } from 'node:module';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export = defineConfig({
  build: {
    target: 'node18',
    outDir: 'build',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
        'debug',
        'fuse.js',
        /^@verdaccio\//,
      ],
    },
  },
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      include: ['src/**/*.ts'],
      outDir: 'build',
    }),
  ],
});
