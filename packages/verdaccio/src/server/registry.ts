import { ChildProcess, fork } from 'child_process';
import buildDebug from 'debug';
import { writeFile } from 'fs/promises';
import getPort from 'get-port';
import path from 'path';

import { fromJStoYAML } from '@verdaccio/config';
import { HTTP_STATUS, TOKEN_BEARER, fileUtils } from '@verdaccio/core';
import { ConfigYaml } from '@verdaccio/types';
import { buildToken } from '@verdaccio/utils';

import { ServerQuery } from './request';

const buildAuthHeader = (token: string): string => {
  return buildToken(TOKEN_BEARER, token);
};

const debug = buildDebug('verdaccio:registry');

export const CREDENTIALS = {
  user: 'fooooo',
  password: 'sms_8tn>V%zPZ_+6', // pragma: allowlist secret
};

export class Registry {
  private childFork: any;
  private configPath: string;
  private domain: string;
  private authstr: string | null = null;
  private port: number;
  private token: string | null = null;
  public constructor(configPath: string, domain: string = 'localhost', port: number = 8080) {
    this.configPath = configPath;
    this.port = port;
    this.domain = domain;
  }

  public static async fromConfigToPath(
    config: Partial<ConfigYaml>
  ): Promise<{ tempFolder: string; configPath: string; yamlContent: string }> {
    debug(`fromConfigToPath`);
    const tempFolder = await fileUtils.createTempFolder('registry-');
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
    return getPort().then((port: number) => {
      this.port = port;
      debug('port %o', port);
      return new Promise((resolve, reject) => {
        let childOptions = {
          silent: false,
        };

        // @ts-ignore
        const debugPort = parseInt(port, 10) + 5;

        childOptions = Object.assign({}, childOptions, {
          execArgv: [`--inspect=${debugPort}`],
          env: {
            DEBUG: process.env.DEBUG,
          },
        });

        const { configPath } = this;
        debug('configPath %s', configPath);
        debug('port %s', port);
        this.childFork = fork(verdaccioPath, ['-c', configPath, '-l', String(port)], childOptions);

        this.childFork.on('message', async (msg: any) => {
          // verdaccio_started is a message that comes from verdaccio in debug mode that
          // notify has been started
          try {
            if ('verdaccio_started' in msg) {
              const server = new ServerQuery(`http://${this.domain}:` + port);
              // const req = await server.debug();
              // req.status(HTTP_STATUS.OK);
              const user = await server.createUser(CREDENTIALS.user, CREDENTIALS.password);
              user.status(HTTP_STATUS.CREATED).body_ok(new RegExp(CREDENTIALS.user));
              // @ts-ignore
              this.token = user?.response?.body.token;
              this.authstr = buildAuthHeader(this.token as string);
              return resolve(this.childFork);
            } else {
              // eslint-disable-next-line no-console
              console.log('msg =>', msg);
            }
          } catch (e) {
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
    });
  }

  public stop(): void {
    return this.childFork.kill('SIGINT');
  }
}
