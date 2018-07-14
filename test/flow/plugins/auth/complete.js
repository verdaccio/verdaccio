// @flow

import Config from '../../../../src/lib/config';
import LoggerApi from '../../../../src/lib/logger';

import type {
	AuthPlugin,
	Config as AppConfig,
	IAuthPlugin,
	Logger,
	PluginOptions
	} from '@verdaccio/types';


// this class is not aim to be tested, just to check flow definitions
class ExampleAuthPlugin implements IAuthPlugin {
	config: AppConfig;
	logger: Logger;

	constructor(config: AppConfig, options: PluginOptions) {
			this.config = config;
			this.logger = options.logger;
	}

	authenticate(user: string, password: string, cb: verdaccio$Callback): void {
		cb();
	}

  allow_access(packageName: string, user: string, cb: verdaccio$Callback): void {
		cb();
	}

  allow_publish(packageName: string, user: string, cb: verdaccio$Callback): void {
		cb();
	}
}

const config1: AppConfig = new Config({
	storage: './storage',
	self_path: '/home/sotrage'
});

const options: PluginOptions = {
	config: config1,
	logger: LoggerApi.logger.child()
}

// $FlowFixMe
const instance1: AuthPlugin = new ExampleAuthPlugin(config1, options);
console.log(instance1);