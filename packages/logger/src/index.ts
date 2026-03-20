import pino from 'pino';

import type { Logger, LoggerConfigItem } from '@verdaccio/types';

import { prepareSetup } from './logger';

export { createLogger, prepareSetup, willUseTransport } from './logger';
export type { LogPlugin, LoggerConfig } from './logger';
export { default as prettifyTransport, autoEnd, buildPretty, buildSafeSonicBoom } from './prettify';
export { hasColors } from './colors';
export { fillInMsgTemplate, printMessage } from './formatter';
export { createPrettyTransport, isPrettyFormat } from './transport';
export type { LevelCode } from './levels';
export { formatLoggingDate, padRight } from './utils';

/**
 * Initialize the logger singleton.
 */
export async function setup(options: LoggerConfigItem): Promise<Logger> {
  if (typeof logger !== 'undefined') {
    return logger;
  }

  logger = await prepareSetup(options, pino);
  return logger;
}

export let logger: Logger;
