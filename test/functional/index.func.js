// @flow
import _ from 'lodash';

import {VerdaccioConfig} from './lib/verdaccio-server';
import Server from './lib/server';
import VerdaccioProcess  from './lib/server_process';
import packageAccess from './package/access';
import type {IServerProcess, IServerBridge} from './lib/types';

describe('functional test verdaccio', function() {

	const servers: IServerBridge[] = [];
	const processRunning = [];
	const config1 = new VerdaccioConfig(
		'./store/test-storage',
		'./store/config-1.yaml',
		'http://localhost:55551/');
	const config2 = new VerdaccioConfig(
			'./store/test-storage2',
			'./store/config-2.yaml',
			'http://localhost:55552/');
	const config3 = new VerdaccioConfig(
				'./store/test-storage3',
				'./store/config-3.yaml',
				'http://localhost:55553/');
	const server1: IServerBridge = new Server(config1.domainPath);
	const server2: IServerBridge = new Server(config2.domainPath);
	const server3: IServerBridge = new Server(config3.domainPath);
	const process1: IServerProcess = new VerdaccioProcess(config1, server1);
	const process2: IServerProcess = new VerdaccioProcess(config2, server2);
	const process3: IServerProcess = new VerdaccioProcess(config3, server3);
	servers.push(server1, server1, server1);

	beforeAll((done) => {
		Promise.all([
			process1.init(),
			process2.init(),
			process3.init()]).then((forks) => {
				_.map(forks, (fork) => {
					processRunning.push(fork[0]);
				});
				done();
		}).catch((error) => {
			done(error);
		});
	});

	afterAll(() => {
		_.map(processRunning, (fork) => {
			fork.stop();
		});
	});

	packageAccess(server1);

	test('process test', () => {
		expect(true).toBeTruthy();

		});
	});

	describe('package access control22', () => {
		test('process test2', () => {
			expect(true).toBeTruthy();
		});

	process.on('unhandledRejection', function(err) {
		console.error("unhandledRejection", err);
		process.nextTick(function() {
			throw err;
		});
	});
});
