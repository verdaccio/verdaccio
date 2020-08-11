import path from "path";
import _ from 'lodash';

import { parseConfigFile} from "@verdaccio/utils";
import { findConfigFile } from "@verdaccio/config";
import { logger, createLogger } from '@verdaccio/logger';
import {startVerdaccio, listenDefaultCallback} from "@verdaccio/node-api";

export const DEFAULT_PROCESS_NAME: string = 'verdaccio';

export default function initProgram(commander,  pkgVersion, pkgName) {
	// FIXME: we need to log before the setup is being applied
	// const initLogger = createLogger();
	const cliListener = commander.listen;
	let configPathLocation;
	let verdaccioConfiguration;
	try {
		configPathLocation = findConfigFile(commander.config);
		verdaccioConfiguration = parseConfigFile(configPathLocation);
		const { web, https, self_path } = verdaccioConfiguration;

		process.title = web?.title || DEFAULT_PROCESS_NAME;

		// note: self_path is only being used by @verdaccio/storage , not really useful and migth be removed soon
		if (!self_path) {
			verdaccioConfiguration = _.assign({}, verdaccioConfiguration, {
				self_path: path.resolve(configPathLocation)
			});
		}

		if (!https) {
			verdaccioConfiguration = _.assign({}, verdaccioConfiguration, {
				https: {enable: false}
			});
		}

		// initLogger.warn({file: configPathLocation}, 'config file  - @{file}');

		startVerdaccio(verdaccioConfiguration, cliListener, configPathLocation, pkgVersion, pkgName, listenDefaultCallback);
	} catch (err) {
		// initLogger.fatal({file: configPathLocation, err: err}, 'cannot open config file @{file}: @{!err.message}');
		process.exit(1);
	}
}
