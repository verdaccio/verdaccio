import { ForkOptions, fork } from 'child_process';
import debug from 'debug';
import path from 'path';

import { fileUtils } from '@verdaccio/core';

import { HTTP_STATUS } from '../../src/lib/constants';
import { IServerBridge, IServerProcess, IVerdaccioConfig } from '../types';
import { CREDENTIALS } from './credentials';

const log = debug('verdaccio:test:process');

export default class VerdaccioProcess implements IServerProcess {
  private bridge: IServerBridge;
  private config: IVerdaccioConfig;
  private childFork?: ReturnType<typeof fork>;
  private silence: boolean;

  constructor(config: IVerdaccioConfig, bridge: IServerBridge, silence = true) {
    this.config = config;
    this.bridge = bridge;
    this.silence = silence;
  }

  public async init(verdaccioPath = '../../bin/verdaccio'): Promise<[VerdaccioProcess, number]> {
    log('creating temporary storage path...');
    const store = await fileUtils.createTempStorageFolder('server-test');
    this.config.storagePath = store;
    log(`storage path set to: %s`, store);

    return this._start(verdaccioPath);
  }

  private _start(verdaccioPath: string): Promise<[VerdaccioProcess, number]> {
    return new Promise((resolve, reject) => {
      const cliPath = path.resolve(__dirname, verdaccioPath);
      const { configPath, port } = this.config;

      const options: ForkOptions = {
        silent: !this.silence,
        stdio: this.silence ? 'ignore' : 'inherit',
      };

      log('forking Verdaccio CLI from: %s', cliPath);
      this.childFork = fork(cliPath, ['-c', configPath, '-l', String(port)], options);

      const handleError = (err: unknown) => {
        log('process error: %O', err);
        reject([err, this]);
      };

      this.childFork.on('message', async (msg: any) => {
        if ('verdaccio_started' in msg) {
          log('verdaccio started message received');
          try {
            const status = await this.bridge.debug().status(HTTP_STATUS.OK);
            await this.bridge
              .auth(CREDENTIALS.user, CREDENTIALS.password)
              .status(HTTP_STATUS.CREATED)
              .body_ok(new RegExp(CREDENTIALS.user));

            log('verdaccio ready, PID: %s', status.pid);
            resolve([this, status.pid]);
          } catch (err) {
            handleError(err);
          }
        }
      });

      this.childFork.on('error', handleError);
      this.childFork.on('disconnect', handleError);
      this.childFork.on('exit', handleError);
    });
  }

  public stop(): void {
    log('stopping verdaccio process...');
    this.childFork?.kill('SIGINT');
  }
}
