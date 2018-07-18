// @flow

// this file is not aim to be tested, just to check flow definitions

import Config from '../../../../src/lib/config';
import LoggerApi from '../../../../src/lib/logger';

import type {
	Config as AppConfig,
	PackageAccess,
	IPluginAuth,
	RemoteUser,
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

  allow_access(user: RemoteUser, pkg: PackageAccess, cb: verdaccio$Callback): void {
		cb();
	}

  allow_publish(user: RemoteUser, pkg: PackageAccess, cb: verdaccio$Callback): void {
		cb();
	}
}

type SubTypePackageAccess = PackageAccess & {
	sub?: boolean
}

class ExampleAuthCustomPlugin implements IPluginAuth {
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

  allow_access(user: RemoteUser, pkg: SubTypePackageAccess, cb: verdaccio$Callback): void {
		cb();
	}

  allow_publish(user: RemoteUser, pkg: SubTypePackageAccess, cb: verdaccio$Callback): void {
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
const authSub = new ExampleAuthCustomPlugin(config1, options);
const remoteUser: RemoteUser = {
	groups: [],
	real_groups: [],
	name: 'test'
};

auth.authenticate('user', 'pass', () => {});
auth.allow_access(remoteUser, {}, () => {});
auth.allow_publish(remoteUser, {}, () => {});
authSub.authenticate('user', 'pass', () => {});
authSub.allow_access(remoteUser, {sub: true}, () => {});
authSub.allow_publish(remoteUser, {sub: true}, () => {});