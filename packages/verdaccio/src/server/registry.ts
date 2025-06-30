import buildDebug from 'debug';
import { ChildProcess, fork } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { fromJStoYAML } from '@verdaccio/config';
import { HTTP_STATUS, TOKEN_BEARER, authUtils, fileUtils } from '@verdaccio/core';
import { ConfigYaml } from '@verdaccio/types';

import { ServerQuery } from './request';

const { writeFile } = fs.promises ? fs.promises : require('fs/promises');

const debug = buildDebug('verdaccio:registry');

const defaultOptions: Options = {
  domain: 'localhost',
  port: 4873,
  createUser: false,
  credentials: {
    user: 'foo',
    password: '12345',
  },
  debug: false,
};

type Options = {
  domain: string;
  port: number;
  createUser: boolean;
  credentials: { user: string; password: string };
  debug: boolean;
};

export class Registry {
  private childFork: any;
  private configPath: string;
  private domain: string;
  private createUser: boolean;
  private authstr: string | null = null;
  private port: number;
  private credentials;
  private token: string | null = null;
  private debug: boolean;
  public constructor(configPath: string, options: Partial<Options> = {}) {
    const _options = { ...defaultOptions, ...options };
    this.configPath = configPath;
    this.createUser = _options.createUser;
    this.port = _options.port;
    this.domain = _options.domain;
    this.debug = _options.debug;
    this.credentials = _options.credentials;
  }

  public static async fromConfigToPath(
    config: Partial<ConfigYaml>
  ): Promise<{ tempFolder: string; configPath: string; yamlContent: string }> {
    debug(`fromConfigToPath`);
    const tempFolder = await fileUtils.createTempFolder('registry');
    debug(`tempFolder %o`, tempFolder);
    const yamlContent = fromJStoYAML(config) as string;
    const configPath = path.join(tempFolder, 'registry.yaml');
    await writeFile(configPath, yamlContent);
    debug(`configPath %o`, configPath);
    return {
      tempFolder,
      configPath,
      yamlContent,
    };
  }

  public init(verdaccioPath: string): Promise<ChildProcess> {
    return this._start(verdaccioPath);
  }

  public getToken() {
    return this.token;
  }

  public getAuthStr() {
    return this.authstr;
  }

  public getPort() {
    return this.port;
  }

  public getDomain() {
    return this.domain;
  }

  public getRegistryUrl() {
    return `http://${this.getDomain()}:${this.getPort()}`;
  }

  private _start(
    verdaccioPath: string = path.join(__dirname, '../../bin/verdaccio')
  ): Promise<ChildProcess> {
    debug('_start %o', verdaccioPath);
    debug('port %o', this.port);
    return new Promise((resolve, reject) => {
      let childOptions = {
        silent: false,
      };

      if (this.debug) {
        const debugPort = this.port + 5;
        debug('debug port %o', debugPort);
        childOptions = Object.assign({}, childOptions, {
          execArgv: [`--inspect=${debugPort}`],
          env: {
            DEBUG: process.env.DEBUG,
            VERDACCIO_SERVER: process.env.VERDACCIO_SERVER,
          },
        });
      } else {
        childOptions = Object.assign({}, childOptions, {
          env: {
            DEBUG: process.env.DEBUG,
            VERDACCIO_SERVER: process.env.VERDACCIO_SERVER,
          },
        });
      }

      const { configPath } = this;
      debug('configPath %s', configPath);
      debug('port %s', this.port);
      this.childFork = fork(
        verdaccioPath,
        ['-c', configPath, '-l', String(this.port)],
        childOptions
      );

      this.childFork.on('message', async (msg: any) => {
        // verdaccio_started is a message that comes from verdaccio in debug mode that
        // notify has been started
        try {
          if ('verdaccio_started' in msg) {
            const server = new ServerQuery(`http://${this.domain}:` + this.port);
            if (this.createUser) {
              const user = await server.createUser(
                this.credentials.user,
                this.credentials.password
              );
              user.status(HTTP_STATUS.CREATED).body_ok(new RegExp(this.credentials.user));
              // @ts-ignore
              this.token = user?.response?.body.token;
              this.authstr = authUtils.buildToken(TOKEN_BEARER, this.token as string);
            }

            return resolve(this.childFork);
          }
        } catch (e: any) {
          // eslint-disable-next-line no-console
          console.error(e);
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject([e, this]);
        }
      });

      this.childFork.on('error', (err) => {
        debug('error  %s', err);
        // eslint-disable-next-line prefer-promise-reject-errors
        reject([err, this]);
      });
      this.childFork.on('disconnect', (err) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject([err, this]);
      });
      this.childFork.on('exit', (err) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject([err, this]);
      });
    });
  }

  public stop(): void {
    return this.childFork.kill('SIGINT');
  }
}
