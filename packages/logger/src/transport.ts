import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { LoggerConfigItem, LoggerFormat } from '@verdaccio/types';

import { hasColors } from './colors';

// Pino transports run in a worker thread and require an absolute path to a built JS file.
// __dirname works in CJS; import.meta.url works in ESM (Node 20+).
function getCurrentDir(): string {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  // @ts-ignore -- import.meta.url requires module: es2020+ but vite preserves it for ESM output
  return dirname(fileURLToPath(import.meta.url));
}
const prettifyPath = join(getCurrentDir(), '..', 'build', 'prettify.js');

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
