import { fork } from 'child_process';
import path from 'path';

import { HTTP_STATUS } from '@verdaccio/commons-api';

export const CREDENTIALS = {
  user: 'foo',
  password: 'test',
};

export default class VerdaccioProcess {
  private bridge;
  private config;
  private childFork;

  public constructor(config, bridge) {
    this.config = config;
    this.bridge = bridge;
  }

  public init(verdaccioPath) {
    return new Promise((resolve, reject) => {
      this._start(verdaccioPath, resolve, reject);
    });
  }

  private _start(verdaccioPath: string, resolve: Function, reject: Function) {
    const verdaccioRegisterWrap: string = path.join(__dirname, verdaccioPath);
    const childOptions = {
      silent: false,
    };

    const { configPath, port } = this.config;
    this.childFork = fork(
      verdaccioRegisterWrap,
      ['-c', configPath, '-l', port as string],
      childOptions
    );

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

    this.childFork.on('error', (err) => reject([err, this]));
    this.childFork.on('disconnect', (err) => reject([err, this]));
    this.childFork.on('exit', (err) => reject([err, this]));
  }

  public stop(): void {
    return this.childFork.kill('SIGINT');
  }
}
