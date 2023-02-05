import pino from 'pino';

import { prepareSetup } from '@verdaccio/logger-commons';
import { Logger, LoggerFormat, LoggerType } from '@verdaccio/types';

let logger: Logger;

export type LoggerConfigItem = {
  type?: LoggerType;
  format?: LoggerFormat;
  path?: string;
  level?: string;
  colors?: boolean;
  async?: boolean;
};

export function setup(options: LoggerConfigItem) {
  if (typeof logger !== 'undefined') {
    return logger;
  }

  logger = prepareSetup(options, pino);
  return logger;
}
