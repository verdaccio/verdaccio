// @flow
import _ from 'lodash';
import rimRaf from 'rimraf';
import path from 'path';
import {fork} from 'child_process';
import type {IVerdaccioConfig, IServerBridge, IServerProcess} from '../flow/types';

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
      const verdaccioRegisterWrap: string = path.join(__dirname, '../../bin/verdaccio');

      rimRaf(this.config.storagePath, (err) => {
        if (_.isNil(err) === false) {
          reject(err);
        }

        this.childFork = fork(verdaccioRegisterWrap,
          ['-c', this.config.configPath],
          {
            silent: this.silence,
            execArgv: [`--inspect=${this.config.port + 5}`]
          },
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

        this.childFork.on('error', (err) => {
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
