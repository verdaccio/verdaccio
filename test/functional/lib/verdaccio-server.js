// @flow
import _ from 'lodash';
import VerdaccioProcess from './server_process';
import type {IVerdaccioConfig, IServerProcess} from './types';

export class VerdaccioConfig implements IVerdaccioConfig {

	storagePath: string;
	configPath: string;
	domainPath: string;

	constructor(storagePath: string, configPath: string, domainPath: string) {
		this.storagePath = storagePath;
		this.configPath = configPath;
		this.domainPath = domainPath;
	}
}

export class VerdaccioServer {

	serverProcess: IServerProcess;
	pid: number;

	constructor(config: IVerdaccioConfig) {
		console.log("*************VerdaccioServer****************");
		this.serverProcess = new VerdaccioProcess(config);
		console.log("*************VerdaccioServer****************");
	}

	start(): Promise<any> {
		console.log("*************VerdaccioServer******start**********");
		return this.serverProcess.init().then(this.debugCheck);
	}

	debugCheck = (): Promise<any> => {
		console.log("*************VerdaccioServer******debugCheck**********");
		return new Promise((resolve, reject) => {
			this.serverProcess.getBridge().debug().status(200).then((body) => {
				if (_.isNil(body.pid)) {
					reject();
				}
				console.log("*************body.pid;******debugCheck**********", body.pid);
				this.pid = body.pid;
				console.log("************authTestUser***");
				return this.authTestUser().catch(function(reason: any) {
					console.log("************authTestUser**reason*", reason);
					reject(reason);
				});
			}).catch(function(reason: any) {
				reject(reason);
			});
		});
	}

	authTestUser(): Promise<any> {
		return this.serverProcess.getBridge().auth('test', 'test')
		.status(201)
		.body_ok(/'test'/);
	}

	stop() {

	}

	notify() {

	}
}