import createDebug from 'debug';

import { warningUtils } from '@verdaccio/core';
import { ConfigYaml, LoggerConfigItem } from '@verdaccio/types';

import { setup } from './logger';

const debug = createDebug('verdaccio:lib:utils');

export async function initLogger(logConfig: ConfigYaml) {
  if (logConfig.logs) {
    logConfig.log = logConfig.logs;
    warningUtils.emit(warningUtils.Codes.VERWAR002);
  }
  debug('initializing logger with config: %o', logConfig.log);
  await setup(logConfig.log as LoggerConfigItem);
}
