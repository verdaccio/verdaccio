import { builtinModules } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';

const nodeBuiltins = new Set([
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]);

/**
 * Copies non-TypeScript files from src/ to the output directory,
 * preserving directory structure. Mirrors Babel's --copy-files behavior.
 */
function copyStaticFiles(srcDir, outDir) {
  return {
    name: 'copy-static-files',
    closeBundle() {
      copyDir(srcDir, outDir);
    },
  };
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      // Skip test directories
      if (entry.name === '__tests__' || entry.name === '__snapshots__' || entry.name === 'test') {
        continue;
      }
      copyDir(srcPath, destPath);
    } else if (!/\.(ts|tsx)$/.test(entry.name)) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Creates a shared Vite config for building Node.js library packages.
 *
 * Outputs both ESM (.mjs) and CJS (.js) to build/ with preserved module structure,
 * source maps, and generated .d.ts type declarations.
 * Dependencies are externalized so they are not bundled.
 *
 * @param {string} dirname - The package directory (__dirname or import.meta.dirname)
 * @param {object} [options] - Override options
 * @param {string|string[]} [options.entry] - Entry file(s) relative to dirname (default: 'src/index.ts')
 * @param {string} [options.outDir] - Output directory (default: 'build')
 * @param {boolean} [options.esmOnly] - When true, output only ESM with .js extensions (for pure ESM packages with "type": "module")
 */
export function createLibConfig(dirname, options = {}) {
  const { entry = 'src/index.ts', outDir = 'build', esmOnly = false, bundleDeps = [] } = options;
  const entries = Array.isArray(entry)
    ? entry.map((e) => path.resolve(dirname, e))
    : path.resolve(dirname, entry);

  const require = createRequire(path.resolve(dirname, 'package.json'));
  const pkg = require('./package.json');

  // Externalize all declared dependencies so they are not bundled.
  const bundleSet = new Set(bundleDeps);
  const externalDeps = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ].filter((dep) => !bundleSet.has(dep)));

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

  return defineConfig({
    plugins: [
      dts({
        tsconfigPath: path.resolve(dirname, 'tsconfig.build.json'),
      }),
      copyStaticFiles(
        path.resolve(dirname, 'src'),
        path.resolve(dirname, outDir)
      ),
    ],
    build: {
      outDir,
      emptyOutDir: true,
      sourcemap: true,
      minify: false,
      lib: {
        entry: entries,
        ...(esmOnly && { formats: ['es'] }),
      },
      rolldownOptions: {
        external: isExternal,
        output: esmOnly
          ? {
            format: 'es',
            entryFileNames: '[name].js',
            ...sharedOutput,
          }
          : [
            {
              format: 'es',
              entryFileNames: '[name].mjs',
              ...sharedOutput,
            },
            {
              format: 'cjs',
              entryFileNames: '[name].js',
              interop: 'auto',
              esModule: true,
              exports: 'named',
              ...sharedOutput,
            },
          ],
      },
    },
  });
}
