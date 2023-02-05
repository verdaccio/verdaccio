// <reference types="node" />
import { isColorSupported } from 'colorette';
import buildDebug from 'debug';

import { fillInMsgTemplate } from '@verdaccio/logger-prettify';
import { Logger, LoggerConfigItem, LoggerFormat } from '@verdaccio/types';

const debug = buildDebug('verdaccio:logger');

function isProd() {
  return process.env.NODE_ENV === 'production';
}

function hasColors(colors: boolean | undefined) {
  if (colors) {
    return isColorSupported;
  }
  return typeof colors === 'undefined' ? true : colors;
}

const DEFAULT_LOG_FORMAT = isProd() ? 'json' : 'pretty';

export type LogPlugin = {
  dest: string;
  options?: any[];
};

type LoggerOptions = { level?: string; path?: string; colors?: boolean; sync?: boolean };

export function createLogger(
  options: LoggerOptions = { level: 'http' },
  // eslint-disable-next-line no-undef
  // @ts-ignore
  destination: NodeJS.WritableStream = pino.destination(1),
  format: LoggerFormat = DEFAULT_LOG_FORMAT,
  pino
): any {
  debug('setup logger');
  let pinoConfig = {
    customLevels: {
      http: 25,
    },
    level: options.level,
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
  };

  debug('has prettifier? %o', !isProd());
  // pretty logs are not allowed in production for performance reasons
  if (['pretty-timestamped', 'pretty'].includes(format) && isProd() === false) {
    pinoConfig = Object.assign({}, pinoConfig, {
      transport: {
        target: '@verdaccio/logger-prettify',
        options: {
          // string or 1 (file descriptor for process.stdout)
          destination: options.path || 1,
          colors: hasColors(options.colors),
          prettyStamp: format === 'pretty-timestamped',
        },
      },
    });
  } else {
    pinoConfig = {
      ...pinoConfig,
      // more info
      // https://github.com/pinojs/pino/blob/v7.1.0/docs/api.md#hooks-object
      // TODO: improve typings here
      // @ts-ignore
      hooks: {
        logMethod(
          inputArgs: [any, any, ...any[]],
          method: {
            apply: (arg0: { logMethod: (inputArgs: any, method: any) => any }, arg1: any[]) => any;
          }
        ) {
          const [templateObject, message, ...otherArgs] = inputArgs;
          const templateVars =
            !!templateObject && typeof templateObject === 'object'
              ? Object.getOwnPropertyNames(templateObject)
              : [];
          if (!message || !templateVars.length) return method.apply(this, inputArgs);
          const hydratedMessage = fillInMsgTemplate(message, templateObject, false);
          return method.apply(this, [templateObject, hydratedMessage, ...otherArgs]);
        },
      },
    };
  }
  const logger = pino(pinoConfig, destination);

  /* eslint-disable */
  /* istanbul ignore next */
  if (process.env.DEBUG) {
    logger.on('level-change', (lvl, val, prevLvl, prevVal) => {
      debug('%s (%d) was changed to %s (%d)', lvl, val, prevLvl, prevVal);
    });
  }

  return logger;
}

const DEFAULT_LOGGER_CONF: LoggerConfigItem = {
  type: 'stdout',
  format: 'pretty',
  level: 'http',
};

export type LoggerConfig = LoggerConfigItem;

export function prepareSetup(options: LoggerConfigItem = DEFAULT_LOGGER_CONF, pino) {
  let logger: Logger;
  let loggerConfig = options;
  if (!loggerConfig?.level) {
    loggerConfig = Object.assign(
      {},
      {
        level: 'http',
      },
      loggerConfig
    );
  }
  const pinoConfig = { level: loggerConfig.level };
  if (loggerConfig.type === 'file') {
    debug('logging file enabled');
    const destination = pino.destination(loggerConfig.path);
    /* eslint-disable */
    /* istanbul ignore next */
    process.on('SIGUSR2', () => destination.reopen());
    // @ts-ignore
    logger = createLogger(
      { level: loggerConfig.level, path: loggerConfig.path, colors: loggerConfig.colors },
      // @ts-ignore
      destination,
      loggerConfig.format,
      pino
    );
    return logger;
  } else {
    debug('logging stdout enabled');
    // @ts-ignore
    logger = createLogger(
      { level: loggerConfig.level, colors: loggerConfig.colors },
      // @ts-ignore
      pino.destination(1),
      loggerConfig.format,
      pino
    );
    return logger;
  }
}

export let logger: Logger;

export function setup(options: LoggerConfigItem, pino) {
  if (typeof logger !== 'undefined') {
    return logger;
  }

  logger = prepareSetup(options, pino);
  return logger;
}
