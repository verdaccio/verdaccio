import createDebug from 'debug';

import { setup as setupModule } from '@verdaccio/logger';

let logger;

const debug = createDebug('verdaccio:logger');

type SetupModuleOptions = Parameters<typeof setupModule>[0];

export function setup(options: SetupModuleOptions): void {
  debug('setup logger with options %o', options);
  if (!logger) {
    debug('logger not initialized, setting up');
    logger = setupModule(options);
    debug('logger initialized');
  }
}

export { logger };
