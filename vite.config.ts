import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

function collectEntries(dir: string, base: string = ''): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file);
    const relPath = base ? `${base}/${file}` : file;
    if (statSync(fullPath).isDirectory()) {
      Object.assign(entries, collectEntries(fullPath, relPath));
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.endsWith('.spec.ts')) {
      const name = relPath.replace(/\.ts$/, '');
      entries[name] = fullPath;
    }
  }
  return entries;
}

const entries = collectEntries(resolve(__dirname, 'src'));

const external = [
  /^node:/,
  /^(fs|path|http|https|url|crypto|stream|zlib|os|util|events|net|tls|child_process|constants|console|assert|module|dns|tty|readline|querystring|string_decoder|buffer|dgram|cluster|worker_threads|perf_hooks|inspector|v8|vm|async_hooks|diagnostics_channel|punycode|process)$/,
  ...Object.keys(pkg.dependencies || {}),
];

const preserveModules = {
  preserveModules: true,
  preserveModulesRoot: 'src',
};

export default defineConfig({
  build: {
    target: 'node24',
    outDir: 'build',
    sourcemap: true,
    minify: false,
    lib: {
      entry: entries,
    },
    rollupOptions: {
      external,
      output: [
        {
          format: 'es',
          dir: 'build/esm',
          entryFileNames: '[name].mjs',
          ...preserveModules,
        },
        {
          format: 'cjs',
          dir: 'build/cjs',
          entryFileNames: '[name].cjs',
          exports: 'named',
          ...preserveModules,
        },
      ],
    },
  },
  define: {
    'process.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
  },
});
