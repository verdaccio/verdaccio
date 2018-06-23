// @flow
import _ from 'lodash';
import rimRaf from 'rimraf';
import path from 'path';
import {fork} from 'child_process';
import type {IVerdaccioConfig, IServerBridge, IServerProcess} from '../types';
import {CREDENTIALS} from '../functional/config.func';

export default class VerdaccioProcess implements IServerProcess {

  bridge: IServerBridge;
  config: IVerdaccioConfig;
  childFork: any;
  isDebug: boolean;
  silence: boolean;

  constructor(config: IVerdaccioConfig, bridge: IServerBridge, silence: boolean = true, isDebug: boolean = false) {
    this.config = config;
    this.bridge = bridge;
    this.silence = silence;
    this.isDebug = isDebug;
  }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      const verdaccioRegisterWrap: string = path.join(__dirname, '../../bin/verdaccio');

      rimRaf(this.config.storagePath, (err) => {
        if (_.isNil(err) === false) {
          reject(err);
        }

        let childOptions = {
          silent: this.silence
        };

        if (this.isDebug) {
          const debugPort = parseInt(this.config.port, 10) + 5;

          childOptions = Object.assign({}, childOptions, {
            execArgv: [`--inspect=${debugPort}`]
          });
        }

        this.childFork = fork(verdaccioRegisterWrap, ['-c', this.config.configPath], childOptions);

        this.childFork.on('message', (msg) => {
          if ('verdaccio_started' in msg) {
            this.bridge.debug().status(200).then((body) => {
              this.bridge.auth(CREDENTIALS.user, CREDENTIALS.password)
                .status(201)
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

      });

    });
  }

  stop(): void {
    return this.childFork.kill('SIGINT');
  }

}
