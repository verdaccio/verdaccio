import { isColorSupported } from 'colorette';
import { join } from 'node:path';

import type { LoggerConfigItem, LoggerFormat } from '@verdaccio/types';

// Pino transports run in a worker thread and require an absolute path to a built JS file.
// Resolve from the package root so it works from both src/ (vitest) and build/ (runtime).
const prettifyPath = join(__dirname, '..', 'build', 'prettify.js');

function hasColors(colors: boolean | undefined) {
  if (colors) {
    return isColorSupported;
  }
  return typeof colors === 'undefined' ? true : colors;
}

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
