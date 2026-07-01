import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Workspace libs declare "exports" → ./build/* only. Vitest must resolve source
 * when build artifacts are missing (local dev / fresh clone).
 *
 * @verdaccio/logger is stubbed: the real package wires pino to build/prettify.js
 * and is not usable from TypeScript source alone.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@verdaccio/config': path.resolve(dirname, '../config/src/index.ts'),
      '@verdaccio/core': path.resolve(dirname, '../core/core/src/index.ts'),
      '@verdaccio/logger': path.resolve(dirname, 'test/test-logger-stub.ts'),
      'verdaccio-auth-memory': path.resolve(dirname, '../plugins/auth-memory/src/index.ts'),
    },
  },
  test: {
    environment: 'node',
  },
});
