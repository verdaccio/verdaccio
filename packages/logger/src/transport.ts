import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { LoggerConfigItem, LoggerFormat } from '@verdaccio/types';

import { hasColors } from './colors';

// Pino transports run in a worker thread via require(), so CJS output must work.
// import.meta.dirname works in ESM; __dirname works in CJS.
const currentDir =
  typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));
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
