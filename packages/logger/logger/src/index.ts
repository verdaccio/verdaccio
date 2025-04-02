import pino from 'pino';

import { prepareSetup } from '@verdaccio/logger-commons';
import { Logger, LoggerConfigItem } from '@verdaccio/types';

export async function setup(options: LoggerConfigItem) {
  if (typeof logger !== 'undefined') {
    return logger;
  }

  logger = await prepareSetup(options, pino);
  return logger;
}

export let logger: Logger;
