import assert from 'assert';
import { fork } from 'child_process';

import { HTTP_STATUS } from '@verdaccio/dev-commons';

import { CREDENTIALS } from './constants';
import { IVerdaccioConfig, IServerBridge, IServerProcess } from './types';
const defaultBinPath = require.resolve('verdaccio/bin/verdaccio');

export default class VerdaccioProcess implements IServerProcess {
  private bridge: IServerBridge;
  private config: IVerdaccioConfig;
  private childFork: any;
  private isDebug: boolean;
  private silence: boolean;

  public constructor(config: IVerdaccioConfig, bridge: IServerBridge, silence = true, isDebug = false) {
    this.config = config;
    this.bridge = bridge;
    this.silence = silence;
    this.isDebug = isDebug;
  }

  public init(verdaccioPath: string = defaultBinPath): Promise<any> {
    assert(typeof verdaccioPath === 'string', 'verdaccio bin path string is required.');
    return new Promise((resolve, reject) => {
      this._start(verdaccioPath, resolve, reject);
    });
  }

  private _start(verdaccioPath: string, resolve: Function, reject: Function) {
    let childOptions = {
      silent: this.silence,
    };

    if (this.isDebug) {
      // @ts-ignore
      const debugPort = parseInt(this.config.port, 10) + 5;

      childOptions = Object.assign({}, childOptions, {
        execArgv: [`--inspect=${debugPort}`],
        env: {
          NODE_DEBUG: 'request',
        },
      });
    }

    const { configPath, port } = this.config;
    this.childFork = fork(verdaccioPath, ['-c', configPath, '-l', port as string], childOptions);

    this.childFork.on('message', (msg) => {
      // verdaccio_started is a message that comes from verdaccio in debug mode that notify has been started
      if ('verdaccio_started' in msg) {
        this.bridge
          .debug()
          .status(HTTP_STATUS.OK)
          .then((body) => {
            this.bridge
              .auth(CREDENTIALS.user, CREDENTIALS.password)
              .status(HTTP_STATUS.CREATED)
              .body_ok(new RegExp(CREDENTIALS.user))
              .then(() => resolve([this, body.pid]), reject);
          }, reject);
      }
    });

    this.childFork.on('error', (err) => {
      reject([err, this]);
    });
    this.childFork.on('disconnect', (err) => {
      reject([err, this]);
    });
    this.childFork.on('exit', (err) => {
      reject([err, this]);
    });
  }

  public stop(): void {
    return this.childFork.kill('SIGINT');
  }
}
