// @flow

import path from 'path';
import {DOMAIN_SERVERS} from '../../functional/config.functional';
import VerdaccioProcess from '../../lib/server_process';
import {VerdaccioConfig} from '../../lib/verdaccio-server';
import Server from '../../lib/server';
import type {IServerBridge} from '../../types';

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
          self_path: store
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
export function mockServer(port: number) {
  const pathStore = path.join(__dirname, '../partials');
  const storePath = path.join(pathStore, '/mock-store');
  const configPath = path.join(pathStore, '/config-unit-mock-server-test.yaml');

  const verdaccioConfig = new VerdaccioConfig(storePath, configPath, `http://${DOMAIN_SERVERS}:${port}/`, port);

  const server: IServerBridge = new Server(verdaccioConfig.domainPath);

  return new VerdaccioProcess(verdaccioConfig, server, false, false, false);
}
