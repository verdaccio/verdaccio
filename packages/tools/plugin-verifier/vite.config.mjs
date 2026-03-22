import { builtinModules, createRequire } from 'node:module';
import path from 'node:path';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

const dirname = import.meta.dirname;
const require = createRequire(path.resolve(dirname, 'package.json'));
const pkg = require('./package.json');

const nodeBuiltins = new Set([
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]);

const externalDeps = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]);

const isExternal = (id) => {
  if (nodeBuiltins.has(id)) return true;
  if (externalDeps.has(id)) return true;
  if ([...externalDeps].some((dep) => id.startsWith(`${dep}/`))) return true;
  return false;
};

const sharedOutput = {
  preserveModules: true,
  preserveModulesRoot: 'src',
};

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: path.resolve(dirname, 'tsconfig.build.json'),
    }),
  ],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: [
        path.resolve(dirname, 'src/index.ts'),
        path.resolve(dirname, 'src/cli.ts'),
      ],
    },
    rolldownOptions: {
      external: isExternal,
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          ...sharedOutput,
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs',
          chunkFileNames: '[name].cjs',
          ...sharedOutput,
        },
      ],
    },
  },
});
