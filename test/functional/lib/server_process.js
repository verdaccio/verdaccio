// @flow
import _ from 'lodash';
import rimRaf from 'rimraf';
import path from 'path';
import {fork} from 'child_process';
import Server from './server';
import type {IVerdaccioConfig, IServerBridge, IServerProcess} from './types';


export default class VerdaccioProcess implements IServerProcess {

		bridge: IServerBridge;
		config: IVerdaccioConfig;
		childFork: any;

		constructor(config: IVerdaccioConfig) {
			console.log("----------<", config);
			this.config = config;
			this.bridge = new Server(config.domainPath);
		}

		init(): Promise<any> {
			console.log("**VerdaccioProcess**:init");
			return new Promise((resolve, reject) => {
				const verdaccioRegisterWrap = path.join(__dirname, '/../../helper/verdaccio-test');
				const storageDir: string = path.join(__dirname, `/../${this.config.storagePath}`);
				const configPath: string = path.join(__dirname, '../', this.config.configPath);

				rimRaf(storageDir, (err) => {
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
						console.log("**VerdaccioProcess**:message", msg);
						if ('verdaccio_started' in msg) {
							resolve(this.childFork);
						}
					});

					this.childFork.on('error', function(err) {
						console.log("**VerdaccioProcess**:error",err);
						reject(err);
					});

					this.childFork.on('disconnect', function(err) {
						console.log("**VerdaccioProcess**:disconnect",err);
						reject(err);
					});

					this.childFork.on('exit', function(err) {
						console.log("**VerdaccioProcess**:exit",err);
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