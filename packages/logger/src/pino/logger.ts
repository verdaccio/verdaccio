import pino from 'pino';
import _ from 'lodash';

const DEFAULT_LOG_FORMAT = 'pretty';
export let logger;
export function createLogger(options = {},
														 destination = pino.destination(1),
														 format: LogFormat = DEFAULT_LOG_FORMAT,
														 prettyPrintOptions = {}) {
	if (_.isNil(format)) {
		format = DEFAULT_LOG_FORMAT;
	}

	let pinoConfig = {
		...options,
		customLevels: {
			http: 35
		},
		serializers: {
			err: pino.stdSerializers.err,
			req: pino.stdSerializers.req,
			res: pino.stdSerializers.res
		},
	};

	if (format === DEFAULT_LOG_FORMAT || format !== 'json') {
		pinoConfig = Object.assign({}, pinoConfig, {
			prettyPrint: {
				levelFirst: true,
				...prettyPrintOptions
			},
			// TODO: this module can be loaded dinamically and allow custom formatting
			prettifier: require('@verdaccio/logger-prettify'),
			}
		)
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
	level: 'http'
};

export type LogPlugin = {
	dest: string;
	options?: any[];
};

export type LogType = 'file' | 'stdout';
export type LogFormat = 'json' | 'pretty-timestamped' | 'pretty';

export type LoggerConfigItem = {
	type?: LogType;
	plugin?: LogPlugin;
	format?: LogFormat;
	path?: string;
	level?: string;
}

export type LoggerConfig = LoggerConfigItem[];

export function setup(options: LoggerConfig | LoggerConfigItem = [DEFAULT_LOGGER_CONF]) {
	const isLegacyConf = _.isArray(options);
	if (isLegacyConf) {
		console.warn("DEPRECATE: logs does not have multi-stream support anymore, please upgrade your logger configuration");
	}

	let loggerConfig = isLegacyConf ? options[0] : options;
	if (!loggerConfig?.level) {
		loggerConfig = Object.assign({}, loggerConfig, {
			level: 'http'
		})
	}

	const pinoConfig = { level: loggerConfig.level };
	if (loggerConfig.type === 'file') {
		logger = createLogger(pinoConfig,
			pino.destination(loggerConfig.path),
			loggerConfig.format);
	} else {
		logger = createLogger(pinoConfig, pino.destination(1), loggerConfig.format);
	}

	process.on('uncaughtException', pino.final(logger, (err, finalLogger) => {
		finalLogger.fatal(err, 'uncaughtException');
		process.exit(1);
	}));

	// @ts-ignore
	process.on('unhandledRejection', pino.final(logger, (err, finalLogger) => {
		finalLogger.fatal(err, 'uncaughtException');
		process.exit(1);
	}));
}
