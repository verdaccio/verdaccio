// @flow
import _ from 'lodash';
import rimRaf from 'rimraf';
import path from 'path';
import {fork} from 'child_process';
import {CREDENTIALS} from '../functional/config.functional';
import {HTTP_STATUS} from '../../src/lib/constants';
import type {IVerdaccioConfig, IServerBridge, IServerProcess} from '../types';

export default class VerdaccioProcess implements IServerProcess {

  bridge: IServerBridge;
  config: IVerdaccioConfig;
  childFork: any;
  isDebug: boolean;
  silence: boolean;
  cleanStore: boolean;

  constructor(config: IVerdaccioConfig,
              bridge: IServerBridge,
              silence: boolean = true,
              isDebug: boolean = false,
              cleanStore: boolean = true) {
    this.config = config;
    this.bridge = bridge;
    this.silence = silence;
    this.isDebug = isDebug;
    this.cleanStore = cleanStore;
  }

  init(verdaccioPath: string = '../../bin/verdaccio'): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.cleanStore) {
        rimRaf(this.config.storagePath, (err) => {
          if (_.isNil(err) === false) {
            reject(err);
          }

          this._start(verdaccioPath, resolve, reject);
        });
      } else {
        this._start(verdaccioPath, resolve, reject);
      }
    });
  }

  _start(verdaccioPath: string, resolve: Function, reject: Function) {
    const verdaccioRegisterWrap: string = path.join(__dirname, verdaccioPath);
    let childOptions = {
      silent: this.silence
    };

    if (this.isDebug) {
      const debugPort = parseInt(this.config.port, 10) + 5;

      childOptions = Object.assign({}, childOptions, {
        execArgv: [`--inspect=${debugPort}`]
      });
    }

    const {configPath, port} = this.config;
    // $FlowFixMe
    this.childFork = fork(verdaccioRegisterWrap, ['-c', configPath, '-l', port], childOptions);

    this.childFork.on('message', (msg) => {
      if ('verdaccio_started' in msg) {
        this.bridge.debug().status(HTTP_STATUS.OK).then((body) => {
          this.bridge.auth(CREDENTIALS.user, CREDENTIALS.password)
            .status(HTTP_STATUS.CREATED)
            .body_ok(new RegExp(CREDENTIALS.user))
            .then(() => {
              resolve([this, body.pid]);
            }, reject)
        }, reject);
      }
    });

    this.childFork.on('error', (err) => {
      console.log('error process', err);
      reject([err, this]);
    });

    this.childFork.on('disconnect', (err) => {
      reject([err, this]);
    });

    this.childFork.on('exit', (err) => {
      reject([err, this]);
    });
  }

  stop(): void {
    return this.childFork.kill('SIGINT');
  }

}
