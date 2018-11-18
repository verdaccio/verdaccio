// @flow

import path from 'path';
import {DOMAIN_SERVERS} from '../../functional/config.functional';
import VerdaccioProcess from '../../lib/server_process';
import {VerdaccioConfig} from '../../lib/verdaccio-server';
import Server from '../../lib/server';
import type {IServerBridge} from '../../types';

export function mockServer(port: number) {
  const pathStore = path.join(__dirname, '../partials');
  const verdaccioConfig = new VerdaccioConfig(
    path.join(pathStore, '/mock-store'),
    path.join(pathStore, '/config-unit-mock-server-test.yaml'), `http://${DOMAIN_SERVERS}:${port}/`, port);
  const server: IServerBridge = new Server(verdaccioConfig.domainPath);

  return new VerdaccioProcess(verdaccioConfig, server, false, false, false);
}
