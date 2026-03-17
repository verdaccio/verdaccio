// <reference types="node" />
import { isColorSupported } from 'colorette';
import buildDebug from 'debug';
import type { LoggerOptions } from 'pino';

import { fillInMsgTemplate } from '@verdaccio/logger-prettify';
import type { Logger, LoggerConfigItem, LoggerFormat } from '@verdaccio/types';

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

export function createLogger(
  options: LoggerConfigItem = { level: 'http' },
  destination: NodeJS.WritableStream,
  format: LoggerFormat = DEFAULT_LOG_FORMAT,
  pino
): any {
  debug('setup logger');
  let pinoConfig: LoggerOptions = {
    customLevels: {
      http: 25,
    },
    level: options.level,
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
    redact: options.redact,
  };

  debug('has prettifier? %o', !isProd());
  // pretty logs are not allowed in production for performance reasons
  if (['pretty-timestamped', 'pretty'].includes(format) && isProd() === false) {
    pinoConfig = {
      ...pinoConfig,
      transport: {
        target: '@verdaccio/logger-prettify',
        options: {
          // string or 1 (file descriptor for process.stdout)
          destination: options.path || 1,
          colors: hasColors(options.colors),
          prettyStamp: format === 'pretty-timestamped',
        },
        worker: {
          name: 'verdaccio-logger-prettify',
        },
      },
    };
  } else {
    pinoConfig = {
      ...pinoConfig,
      // https://getpino.io/#/docs/api?id=hooks-object
      hooks: {
        logMethod(args: [obj: unknown, msg?: string, ...rest: unknown[]], method, _level) {
          const [templateObject, message, ...otherArgs] = args;
          const templateVars =
            !!templateObject && typeof templateObject === 'object'
              ? Object.getOwnPropertyNames(templateObject)
              : [];
          if (!message || !templateVars.length) return method.apply(this, args);
          const hydratedMessage = fillInMsgTemplate(message, templateObject as any, false);
          return method.apply(this, [templateObject, hydratedMessage, ...otherArgs] as any);
        },
      },
    };
  }
  const logger = pino(pinoConfig, destination);

  if (process.env.DEBUG) {
    logger.on('level-change', (lvl, val, prevLvl, prevVal, instance) => {
      if (logger !== instance) {
        return;
      }
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

export function willUseTransport(format: LoggerFormat | undefined): boolean {
  const resolvedFormat = format ?? (isProd() ? 'json' : 'pretty');
  return ['pretty-timestamped', 'pretty'].includes(resolvedFormat) && isProd() === false;
}

export function prepareSetup(options: LoggerConfigItem = DEFAULT_LOGGER_CONF, pino) {
  let logger: Logger;
  let loggerConfig = options;
  if (!loggerConfig?.level) {
    loggerConfig = {
      ...loggerConfig,
      level: 'http',
    };
  }
  if (loggerConfig.type === 'file') {
    debug('logging file enabled');
    // When using a pino transport (pretty format), the transport creates its own
    // destination stream. Creating a pino.destination() here would be unused but
    // still registered with on-exit-leak-free, causing "sonic boom is not ready yet"
    // crashes if the process exits before the file is opened.
    if (willUseTransport(loggerConfig.format)) {
      logger = createLogger(loggerConfig, pino.destination(1), loggerConfig.format, pino);
    } else {
      const destination = pino.destination(loggerConfig.path);
      process.on('SIGUSR2', () => destination.reopen());
      logger = createLogger(loggerConfig, destination, loggerConfig.format, pino);
    }
    return logger;
  } else {
    debug('logging stdout enabled');
    logger = createLogger(loggerConfig, pino.destination(1), loggerConfig.format, pino);
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
