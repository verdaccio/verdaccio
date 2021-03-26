import path from 'path';
import fs from 'fs';
import os from 'os';
import * as fsExtra from 'fs-extra';
import { DOMAIN_SERVERS } from './constants';
import VerdaccioProcess from './server_process';
import { VerdaccioConfig } from './verdaccio-server';
import Server, { IServerBridge } from './server';

/**
 * Fork a Verdaccio process with a custom configuration.
 *
 * Usage:
 *
 *  - Fork the process within the beforeAll body.
 *  - Define a storage (use a specific name)
 *  - Define a unique port (be careful with conflicts)
 *  - Set a configuration
 *  - await / mockServer
 *  - call done();
 *
 *  beforeAll(function(done) {
      const store = path.join(__dirname, '../partials/store/test-profile-storage');
      const mockServerPort = 55544;
      rimraf(store, async () => {
        const parsedConfig = parseConfigFile(parseConfigurationProfile());
        const configForTest = _.assign({}, _.cloneDeep(parsedConfig), {
          storage: store,
          auth: {
            htpasswd: {
              file: './test-profile-storage/.htpasswd'
            }
          },
          config_path: store
        });
        app = await endPointAPI(configForTest);
        mockRegistry = await mockServer(mockServerPort).init();
        done();
    });

   On finish the test we must close the server

   afterAll(function(done) {
    mockRegistry[0].stop();
    done();
   });

 *
 *
 * @param port
 * @returns {VerdaccioProcess}
 */
export function mockServer(port: number, options: MockRegistryOptions = {}) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), '/verdaccio-test'));

  // default locations
  const configPath = path.join(__dirname, './config/yaml', '/mock-server-test.yaml');
  const mockStorePath = path.join(__dirname, '/fixtures/mock-store');

  // default options
  const localOptions: MockRegistryOptions = {
    port,
    configPath,
    storePath: mockStorePath,
    rootFolder: tempRoot,
    silence: true,
    debug: false,
  };

  // mix external options
  const finalOptions: MockRegistryOptions = Object.assign({}, localOptions, options);
  // final locations
  const tempConfigFile = path.join(tempRoot, 'verdaccio.yaml');
  const storePath = path.join(tempRoot, '/mock-store');

  fs.copyFileSync(finalOptions.configPath!, tempConfigFile);
  fsExtra.copySync(finalOptions.storePath!, storePath);

  const verdaccioConfig = new VerdaccioConfig(
    storePath,
    tempConfigFile,
    `http://${DOMAIN_SERVERS}:${port}/`,
    port
  );
  const server: IServerBridge = new Server(verdaccioConfig.domainPath);

  return new VerdaccioProcess(verdaccioConfig, server, finalOptions.silence, finalOptions.debug);
}

export interface MockRegistryOptions {
  rootFolder?: string;
  configPath?: string;
  port?: number;
  storePath?: string;
  silence?: boolean;
  debug?: boolean;
}
