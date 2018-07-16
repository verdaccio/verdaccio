// @flow

// this file is not aim to be tested, just to check flow definitions

import Config from '../../../../src/lib/config';
import LoggerApi from '../../../../src/lib/logger';

import type {
	Config as AppConfig,
	IPluginAuth,
	Logger,
	PluginOptions
	} from '@verdaccio/types';

class ExampleAuthPlugin implements IPluginAuth {
	config: AppConfig;
	logger: Logger;

	constructor(config: AppConfig, options: PluginOptions) {
			this.config = config;
			this.logger = options.logger;
	}

	adduser(user: string, password: string, cb: verdaccio$Callback): void {
		cb();
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

const auth = new ExampleAuthPlugin(config1, options);

auth.authenticate('user', 'pass', () => {});
auth.allow_access('packageName', 'user', () => {});
auth.allow_publish('packageName', 'user', () => {});
