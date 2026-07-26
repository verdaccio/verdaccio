import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { LoggerConfigItem, LoggerFormat } from '@verdaccio/types';

import { hasColors } from './colors';

// Pino transports run in a worker thread via require(), so CJS output must work.
// rolldown lowers `import.meta` to `{}` in the CJS output, so `import.meta.url`
// is only truthy in the ESM build; module-scoped __dirname covers the CJS build
// (checking `typeof __dirname` instead is unsafe: node -e and the REPL leak it
// as a global into ES modules)
const currentDir = import.meta.url ? dirname(fileURLToPath(import.meta.url)) : __dirname;
const prettifyPath = join(currentDir, '..', 'build', 'prettify.js');

export function isPrettyFormat(format: LoggerFormat | undefined): boolean {
  return ['pretty-timestamped', 'pretty'].includes(format ?? 'pretty');
}

/**
 * Create a pino pretty transport for non-production environments.
 */
export function createPrettyTransport(pino: any, options: LoggerConfigItem, format: LoggerFormat) {
  return pino.transport({
    target: prettifyPath,
    options: {
      destination: options.path || 1,
      colors: hasColors(options.colors),
      prettyStamp: format === 'pretty-timestamped',
      sync: options.sync ?? false,
    },
    worker: {
      name: 'verdaccio-logger-prettify',
    },
  });
}
