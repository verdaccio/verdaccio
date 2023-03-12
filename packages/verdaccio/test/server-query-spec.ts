import getPort from 'get-port';
import nock from 'nock';
import path from 'path';

import { generateRemotePackageMetadata } from '@verdaccio/test-helper';

import { Registry, ServerQuery } from '../src/server';

const configFile = path.join(__dirname, './config.yaml');

describe('server query', () => {
  test('server run', async () => {
    const port = await getPort({ port: 4001 });
    const registry = new Registry(configFile, { port });
    const vPath = path.join(__dirname, '../bin/verdaccio');
    const d = await registry.init(vPath);
    expect(d.pid).toBeDefined();
    expect(registry.getPort()).toBeDefined();
    expect(registry.getAuthStr()).toBeDefined();
    expect(registry.getToken).toBeDefined();
    registry.stop();
  });

  test('server create user', async () => {
    const port = await getPort({ port: 4002 });
    const registry = new Registry(configFile, { createUser: true, port });
    const vPath = path.join(__dirname, '../bin/verdaccio');
    const d = await registry.init(vPath);
    expect(d.pid).toBeDefined();
    registry.stop();
  });

  test('fetch debug ok', async () => {
    nock('https://registry.verdaccio.org').get(`/-/_debug`).reply(201, { ok: 'debug' });
    expect(true).toBeTruthy();
    const server = new ServerQuery('https://registry.verdaccio.org');
    const query = await server.debug();
    query.status(201).body_ok(/debug/);
  });

  test('fetch debug fail', async () => {
    nock('https://registry.verdaccio.org').get(`/-/_debug`).reply(500, { error: 'fail debug' });
    expect(true).toBeTruthy();
    const server = new ServerQuery('https://registry.verdaccio.org');
    const query = await server.debug();
    query.status(500).body_error(/fail debug/);
  });

  test('fetch package ok', async () => {
    const pkgName = 'upstream';
    const upstreamManifest = generateRemotePackageMetadata(
      pkgName,
      '1.0.0',
      'https://registry.domain.org'
    );
    nock('https://registry.domain.org').get(`/upstream`).reply(201, upstreamManifest);
    expect(true).toBeTruthy();
    const server = new ServerQuery('https://registry.domain.org');
    const query = await server.getPackage('upstream');
    query.status(201).body_ok(upstreamManifest);
  });
});
