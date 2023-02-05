import pino from 'pino';

import { prepareSetup } from '@verdaccio/logger-commons';
import { Logger, LoggerConfigItem } from '@verdaccio/types';

let logger: Logger;

export function setup(options: LoggerConfigItem) {
  if (typeof logger !== 'undefined') {
    return logger;
  }

  logger = prepareSetup(options, pino);
  return logger;
}
