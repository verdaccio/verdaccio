import createDebug from 'debug';

import { setup as setupModule } from '@verdaccio/logger';
import { Logger } from '@verdaccio/types';

let logger: Logger;

const debug = createDebug('verdaccio:logger');

type SetupModuleOptions = Parameters<typeof setupModule>[0];

export async function setup(options: SetupModuleOptions): Promise<void> {
  debug('setup logger with options %o', options);
  if (!logger) {
    debug('logger not initialized, setting up');
    logger = await setupModule(options);
    debug('logger initialized');
  }
}

export { logger };
