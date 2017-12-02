// @flow
import _ from 'lodash';
import rimRaf from 'rimraf';
import path from 'path';
import {fork} from 'child_process';
import type {IVerdaccioConfig, IServerBridge, IServerProcess} from './types';

export default class VerdaccioProcess implements IServerProcess {

		bridge: IServerBridge;
		config: IVerdaccioConfig;
		childFork: any;
		silence: boolean;

		constructor(config: IVerdaccioConfig, bridge: IServerBridge, silence: boolean = true) {
			this.config = config;
			this.bridge = bridge;
			this.silence = silence;
		}

		init(): Promise<any> {
			return new Promise((resolve, reject) => {
				const verdaccioRegisterWrap: string = path.join(__dirname, '../../../bin/verdaccio');
				const storageDir: string = path.join(__dirname, `/../${this.config.storagePath}`);
				const configPath: string = path.join(__dirname, '../', this.config.configPath);

				rimRaf(storageDir, (err) => {
					if (_.isNil(err) === false) {
						reject(err);
					}

					this.childFork = fork(verdaccioRegisterWrap,
						['-c', configPath],
						{
							silent: this.silence
						}
					);

					this.childFork.on('message', (msg) => {
						if ('verdaccio_started' in msg) {
							this.bridge.debug().status(200).then((body) => {
								this.bridge.auth('test', 'test')
									.status(201)
									.body_ok(/'test'/)
									.then(() => {
										resolve([this, body.pid]);
									}, reject)
							}, reject);
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

				});

			});
		}

		stop(): void {
			return this.childFork.kill('SIGINT');
		}

	}