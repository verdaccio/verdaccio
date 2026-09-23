// <reference types="node" />
import buildDebug from 'debug';
import { unregister as onExitUnregister } from 'on-exit-leak-free';
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
    const destination = pino.destination({
      dest: loggerConfig.path,
      sync: loggerConfig.sync ?? false,
      minLength: 0,
    });
    let errorLogger: Logger | undefined;
    let reopening = false;
    let reopenListeners: (() => void)[] = [];
    const onReopenReady = () => {
      reopening = false;
      reopenListeners = [];
    };
    const reportedErrors = new WeakSet<Error>();
    const onRuntimeError = (error: Error) => {
      // Pino re-emits errors; synchronous reopen failures also throw the same error.
      if (reportedErrors.has(error)) return;
      reportedErrors.add(error);
      // Failed reopens otherwise leave callbacks that close the old fd again on recovery.
      for (const listener of reopenListeners) destination.removeListener('ready', listener);
      destination.removeListener('ready', onReopenReady);
      reopening = false;
      reopenListeners = [];
      const reporter: Logger = (errorLogger ??= createLogger(
        { level: 'error', redact: loggerConfig.redact },
        pino.destination({ dest: 2, sync: true, minLength: 0 }),
        'json',
        pino
      ));
      reporter.error({ err: error, path: loggerConfig.path }, 'file log destination error');
    };
    await new Promise<void>((resolve, reject) => {
      const onReady = () => {
        destination.removeListener('error', onError);
        destination.on('error', onRuntimeError);
        resolve();
      };
      const onError = (error: Error) => {
        destination.removeListener('ready', onReady);
        // A failed open leaves fd=-1, so Pino's exit flush would throw.
        // SonicBoom.destroy() waits for ready here; unregister the failed stream directly.
        onExitUnregister(destination);
        reject(error);
      };
      destination.once('ready', onReady);
      destination.once('error', onError);
    });
    debug('file destination ready: %s', loggerConfig.path);
    const reopen = destination.reopen.bind(destination);
    // SonicBoom can defer reopening until a pending write finishes.
    destination.reopen = (file?: string) => {
      if (!reopening) {
        reopening = true;
        destination.once('ready', onReopenReady);
      }
      const previousListeners = new Set(destination.rawListeners('ready'));
      let reopenError: Error | undefined;
      try {
        reopen(file);
      } catch (error) {
        reopenError = error as Error;
      } finally {
        reopenListeners.push(
          ...destination
            .rawListeners('ready')
            .filter((listener) => !previousListeners.has(listener))
        );
      }
      if (reopenError) onRuntimeError(reopenError);
    };
    process.on('SIGUSR2', () => {
      if (!reopening) destination.reopen();
    });
    return createLogger(loggerConfig, destination, loggerConfig.format, pino);
  }
  debug('logging stdout enabled');
  const destination = willUseTransport(loggerConfig.format)
    ? undefined
    : pino.destination({ dest: 1, sync: loggerConfig.sync ?? false, minLength: 0 });
  return createLogger(loggerConfig, destination, loggerConfig.format, pino);
}
