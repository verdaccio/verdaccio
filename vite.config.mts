import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };

// Files that babel used to bring along via --copy-files.
const copyStaticAssets = () => ({
  name: 'verdaccio:copy-static-assets',
  closeBundle() {
    const target = path.resolve(__dirname, 'build/api/web/html/favicon.ico');
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.resolve(__dirname, 'src/api/web/html/favicon.ico'), target);
  },
});

// every source file is its own entry so the build keeps the exact same file
// layout babel produced (same approach as the 7.x branch)
function collectEntries(dir: string, base: string = ''): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    const relPath = base ? `${base}/${file}` : file;
    if (fs.statSync(fullPath).isDirectory()) {
      Object.assign(entries, collectEntries(fullPath, relPath));
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts') && !file.endsWith('.spec.ts')) {
      entries[relPath.replace(/\.ts$/, '')] = fullPath;
    }
  }
  return entries;
}

export default defineConfig({
  define: {
    'process.env.PACKAGE_VERSION': JSON.stringify(process.env.PACKAGE_VERSION ?? pkg.version),
  },
  plugins: [copyStaticAssets()],
  build: {
    target: 'node20',
    outDir: 'build',
    minify: false,
    sourcemap: true,
    lib: {
      entry: collectEntries(path.resolve(__dirname, 'src')),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Keep dependencies and node builtins as runtime imports; only transpile our sources.
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
      output: [
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].mjs',
          exports: 'named',
        },
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: 'src',
          entryFileNames: '[name].js',
          exports: 'named',
        },
      ],
    },
  },
});
