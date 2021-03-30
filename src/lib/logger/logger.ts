import pino from 'pino';
import _ from 'lodash';
import buildDebug from 'debug';
import { yellow } from 'kleur';
import { padLeft } from './utils';

function isProd() {
  return process.env.NODE_ENV === 'production';
}

export let logger;
const debug = buildDebug('verdaccio:logger');
const DEFAULT_LOG_FORMAT = isProd() ? 'json' : 'pretty';

export type LogPlugin = {
  dest: string;
  options?: any[];
};

export type LogType = 'file' | 'stdout';
export type LogFormat = 'json' | 'pretty-timestamped' | 'pretty';

export function createLogger(
  options = {},
  destination = pino.destination(1),
  format: LogFormat = DEFAULT_LOG_FORMAT,
  prettyPrintOptions = {
    // we hide warning since the prettifier should not be used in production
    // https://getpino.io/#/docs/pretty?id=prettifier-api
    suppressFlushSyncWarning: true,
  }
) {
  if (_.isNil(format)) {
    format = DEFAULT_LOG_FORMAT;
  }

  let pinoConfig = {
    ...options,
    customLevels: {
      http: 35,
    },
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
  };

  debug('has prettifier? %o', !isProd());
  // pretty logs are not allowed in production for performance reasons
  if ((format === DEFAULT_LOG_FORMAT || format !== 'json') && isProd() === false) {
    pinoConfig = Object.assign({}, pinoConfig, {
      // more info
      // https://github.com/pinojs/pino-pretty/issues/37
      prettyPrint: {
        levelFirst: true,
        prettyStamp: format === 'pretty-timestamped',
        ...prettyPrintOptions,
      },
      prettifier: require('./formatter'),
    });
  }

  return pino(pinoConfig, destination);
}

export function getLogger() {
  if (_.isNil(logger)) {
    console.warn('logger is not defined');
    return;
  }

  return logger;
}

const DEFAULT_LOGGER_CONF: LoggerConfigItem = {
  type: 'stdout',
  format: 'pretty',
  level: 'http',
};

export type LoggerConfigItem = {
  type?: LogType;
  plugin?: LogPlugin;
  format?: LogFormat;
  path?: string;
  level?: string;
};

export type LoggerConfig = LoggerConfigItem[];

export function setup(options: LoggerConfig | LoggerConfigItem = [DEFAULT_LOGGER_CONF]) {
  debug('setup logger');
  const isLegacyConf = Array.isArray(options);
  if (isLegacyConf) {
    const deprecateMessage = 'deprecate: multiple logger configuration is deprecated, please check the migration guide.';
    // eslint-disable-next-line no-console
    console.log(yellow(padLeft(deprecateMessage)));
  }

  // verdaccio 5 does not allow multiple logger configuration
  // backward compatible, pick only the first option
  // next major will thrown an error
  let loggerConfig = isLegacyConf ? options[0] : options;
  if (!loggerConfig?.level) {
    loggerConfig = Object.assign({}, loggerConfig, {
      level: 'http',
    });
  }

  const pinoConfig = { level: loggerConfig.level };
  if (loggerConfig.type === 'file') {
    debug('logging file enabled');
    logger = createLogger(pinoConfig, pino.destination(loggerConfig.path), loggerConfig.format);
  } else if (loggerConfig.type === 'rotating-file') {
    // eslint-disable-next-line no-console
    console.log(yellow(padLeft('rotating-file type is not longer supported, consider use [logrotate] instead')));
    // eslint-disable-next-line no-console
    console.log(yellow(padLeft('fallback to stdout configuration triggered')));
    debug('logging stdout enabled');
    logger = createLogger(pinoConfig, pino.destination(1), loggerConfig.format);
  } else {
    debug('logging stdout enabled');
    logger = createLogger(pinoConfig, pino.destination(1), loggerConfig.format);
  }

  if (isProd()) {
    // why only on prod? https://github.com/pinojs/pino/issues/920#issuecomment-710807667
    const finalHandler = pino.final(logger, (err, finalLogger, event) => {
      finalLogger.info(`${event} caught`);
      if (err) {
        finalLogger.error(err, 'error caused exit');
      }
      process.exit(err ? 1 : 0);
    });

    process.on('uncaughtException', (err) => finalHandler(err, 'uncaughtException'));
    process.on('unhandledRejection', (err) => finalHandler(err as Error, 'unhandledRejection'));
    process.on('beforeExit', () => finalHandler(null, 'beforeExit'));
    process.on('exit', () => finalHandler(null, 'exit'));
    process.on('uncaughtException', (err) => finalHandler(err, 'uncaughtException'));
    process.on('SIGINT', () => finalHandler(null, 'SIGINT'));
    process.on('SIGQUIT', () => finalHandler(null, 'SIGQUIT'));
    process.on('SIGTERM', () => finalHandler(null, 'SIGTERM'));
  }
}
