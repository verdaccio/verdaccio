// <reference types="node" />
import buildDebug from 'debug';
import type { LoggerOptions } from 'pino';

import type { Logger, LoggerConfigItem, LoggerFormat } from '@verdaccio/types';

import { fillInMsgTemplate } from './formatter';
import { createPrettyTransport, isPrettyFormat } from './transport';

const debug = buildDebug('verdaccio:logger');

function isProd() {
  return process.env.NODE_ENV === 'production';
}

const DEFAULT_LOG_FORMAT = isProd() ? 'json' : 'pretty';
debug('default log format: %s', DEFAULT_LOG_FORMAT);

export type LogPlugin = {
  dest: string;
  options?: any[];
};

export function createLogger(
  options: LoggerConfigItem = { level: 'http' },
  destination: NodeJS.WritableStream | undefined,
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
  let logger;
  // pretty logs are not allowed in production for performance reasons
  if (isPrettyFormat(format) && isProd() === false) {
    const transport = createPrettyTransport(pino, options, format);
    logger = pino(pinoConfig, transport);
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
    logger = pino(pinoConfig, destination);
  }

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
  return isPrettyFormat(resolvedFormat) && isProd() === false;
}

export async function prepareSetup(
  options: LoggerConfigItem = DEFAULT_LOGGER_CONF,
  pino
): Promise<Logger> {
  let loggerConfig = options;
  if (!loggerConfig?.level) {
    loggerConfig = {
      ...loggerConfig,
      level: 'http',
    };
  }
  if (loggerConfig.type === 'file') {
    debug('logging file enabled');
    // Pretty format uses a pino transport that creates its own destination stream,
    // so no destination is needed here.
    if (willUseTransport(loggerConfig.format)) {
      return createLogger(loggerConfig, undefined, loggerConfig.format, pino);
    }
    // For file destinations (json format), wait for the fd to be ready
    // so we fail fast on bad paths / permissions instead of losing early logs
    const destination = pino.destination(loggerConfig.path);
    await new Promise<void>((resolve, reject) => {
      destination.once('ready', resolve);
      destination.once('error', reject);
    });
    debug('file destination ready: %s', loggerConfig.path);
    process.on('SIGUSR2', () => destination.reopen());
    return createLogger(loggerConfig, destination, loggerConfig.format, pino);
  }
  debug('logging stdout enabled');
  return createLogger(loggerConfig, pino.destination(1), loggerConfig.format, pino);
}
