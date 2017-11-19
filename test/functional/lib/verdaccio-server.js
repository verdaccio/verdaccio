// @flow
import _ from 'lodash';
import express from 'express';
import rimRaf from 'rimraf';
import path from 'path';
import {fork} from 'child_process';
import bodyParser from 'body-parser';
import Server from './server';
import type {IVerdaccioConfig, IServerBridge, IServerProcess} from './types';

export class ExpressServer {
	static start(): Promise<any> {
		return new Promise(function(resolve, reject) {
			const app = express();

			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({
				extended: true
			}));

			app.listen(55550, function starExpressServer() {
				resolve();
			});
		});
	}
}

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

class VerdaccioProcess implements IServerProcess {

	bridge: IServerBridge;
	config: IVerdaccioConfig;
	childFork: any;

	constructor(config: IVerdaccioConfig) {
		this.config = config;
		this.bridge = new Server(config.domainPath);
	}

	init(): Promise<any> {
		return new Promise(function(resolve, reject) {
			const verdaccioRegisterWrap = path.join(__dirname, '/../../helper/verdaccio-test');
			const storageDir: string = path.join(__dirname, `/../${this.config.storagePath}`);
			const configPath: string = path.join(__dirname, '../', this.config.configPath);

			rimRaf(storageDir, function(err) {
				if (_.isNil(err) === false) {
					reject(err);
				}

				// const filteredArguments = process.execArgv = process.execArgv.filter(function(x) {
				// 	// filter out --debug-brk and --inspect-brk since Node7
				// 	return (x.indexOf('--debug-brk') === -1  && x.indexOf('--inspect-brk') === -1);
				// });

				this.childFork = fork(verdaccioRegisterWrap,
					['-c', configPath],
					{
						// silent: !process.env.TRAVIS,
						silent: false,
						env: {
							BABEL_ENV: 'registry'
						}
					}
				);

				// forks.push(childFork);

				this.childFork.on('message', function(msg) {
					if ('verdaccio_started' in msg) {
						resolve(this.childFork);
					}
				});

				this.childFork.on('error', function(err) {
					reject(err);
				});

				this.childFork.on('disconnect', function(err) {
					reject(err);
				});

				this.childFork.on('exit', function(err) {
					reject(err);
				});

				//process.execArgv = filteredArguments;
			});

		});
	}

	getBridge(): IServerBridge {
		return this.bridge;
	}

	stop(): Promise<any> {
		return new Promise(function(resolve, reject) {

		});
	}

	notify(callback: Function): void {
		callback();
	}

	cleanStorage(): Promise<any> {
		return new Promise(function(resolve, reject) {
			rimRaf(this.config.storagePath, function(err) {
				if(_.isNil(err) === false) {
					reject(err);
				}
			});
		});
	}
}

export class VerdaccioServer {

	serverProcess: IServerProcess;
	pid: number;

	constructor(config: IVerdaccioConfig) {
		this.serverProcess = new VerdaccioProcess(config);
	}

	start(): Promise<any> {
		return this.serverProcess.init().then(this.debugCheck);
	}

	debugCheck(): Promise<any>{
		return new Promise((resolve, reject) => {
			this.serverProcess.getBridge().debug().status(200).then((body) => {
				if (_.isNil(body.pid)) {
					reject();
				}
				this.pid = body.pid;
				return this.authTestUser().catch(function(reason: any) {
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