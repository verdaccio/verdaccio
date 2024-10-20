import getPort from 'get-port';
import { afterAll, beforeAll, describe, test } from 'vitest';

import { ConfigBuilder } from '@verdaccio/config';
import { HTTP_STATUS, constants, fileUtils } from '@verdaccio/core';

import { Registry, ServerQuery } from '../src/server';

describe('multiple proxy registries configuration', () => {
  let registry;
  let registry2;
  let registry3;

  beforeAll(async function () {
    // server 1 configuration
    const storage = await fileUtils.createTempStorageFolder('storage-server1');
    const configuration = ConfigBuilder.build()
      .addStorage(storage)
      .addPackageAccess('jquery', {
        access: constants.ROLES.$AUTH,
        publish: constants.ROLES.$AUTH,
      })
      .addPackageAccess('webpack', {
        access: constants.ROLES.$AUTH,
        publish: constants.ROLES.$AUTH,
      })
      .addPackageAccess('react', {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$AUTH,
        proxy: 'npmjs',
      })
      .addPackageAccess(constants.PACKAGE_ACCESS.ALL, {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$ALL,
      })
      .addAuth({
        htpasswd: {
          file: './htpasswd-server1',
        },
      })
      .addLogger({ level: 'debug', type: 'stdout', format: 'pretty' })
      .addUplink('npmjs', { url: 'https://registry.npmjs.com' });

    const confRegistry = await Registry.fromConfigToPath(configuration.getConfig());
    const port = await getPort({ port: 3001 });
    registry = new Registry(confRegistry.configPath, { port });
    await registry.init();

    // server 3 configuration
    const storage3 = await fileUtils.createTempStorageFolder('storage-server2');
    const configuration3 = ConfigBuilder.build()
      .addStorage(storage3)
      .addPackageAccess('webpack', {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$AUTH,
        proxy: 'npmjs',
      })
      .addPackageAccess(constants.PACKAGE_ACCESS.ALL, {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$ALL,
      })
      .addAuth({
        htpasswd: {
          file: './htpasswd-server1',
        },
      })
      .addLogger({ level: 'debug', type: 'stdout', format: 'pretty' })
      .addUplink('npmjs', { url: 'https://registry.npmjs.com' });
    const confRegistry3 = await Registry.fromConfigToPath(configuration3.getConfig());
    const port3 = await getPort({ port: 3002 });
    registry3 = new Registry(confRegistry3.configPath, { port: port3 });
    await registry3.init();

    // server 2 configuration
    const storage1 = await fileUtils.createTempStorageFolder('storage-server2');
    const configuration2 = ConfigBuilder.build()
      .addStorage(storage1)
      .addPackageAccess('pnpm', {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$ALL,
        proxy: 'broken',
      })
      .addPackageAccess('timeout-pkg', {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$ALL,
        proxy: 'timeout',
      })
      .addPackageAccess('yarn', {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$ALL,
        proxy: 'no-retry',
      })
      .addPackageAccess(constants.PACKAGE_ACCESS.ALL, {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$ALL,
        proxy: 'local1 local3',
      })
      .addAuth({
        htpasswd: {
          file: './htpasswd-server2',
        },
      })
      .addLogger({ level: 'debug', type: 'stdout', format: 'pretty' })
      // server 2 is proxied to server 1 and server 3
      .addUplink('local1', { url: `http://localhost:${registry.getPort()}` })
      .addUplink('local3', { url: `http://localhost:${registry3.getPort()}` })
      .addUplink('broken', { url: `http://doesnotexist.local` })
      .addUplink('no-retry', { url: `http://no-retry.local`, max_fails: 0 })
      .addUplink('timeout', { url: `http://timeout.local`, max_fails: 0, timeout: '1s' });
    const confRegistry2 = await Registry.fromConfigToPath(configuration2.getConfig());
    const port2 = await getPort({ port: 3004 });
    registry2 = new Registry(confRegistry2.configPath, { port: port2 });
    await registry2.init();
  });

  test('should fetch package through a proxy', async function () {
    const server = new ServerQuery(registry.getRegistryUrl());
    const server2 = new ServerQuery(registry2.getRegistryUrl());
    await server.addPackage('package-proxy');
    (await server2.getPackage('package-proxy')).status(HTTP_STATUS.OK);
  });

  test('should fails if proxy server does not authorize with not found', async function () {
    const server2 = new ServerQuery(registry2.getRegistryUrl());
    (await server2.getPackage('jquery')).status(HTTP_STATUS.NOT_FOUND);
  });

  test('should fetch package through proxy server (test requires internet conection)', async function () {
    const server2 = new ServerQuery(registry2.getRegistryUrl());
    (await server2.getPackage('react')).status(HTTP_STATUS.OK);
  });

  test('should fetch webpack from secondary option proxy registry (test requires internet conection)', async function () {
    const server2 = new ServerQuery(registry2.getRegistryUrl());
    (await server2.getPackage('webpack')).status(HTTP_STATUS.OK);
  });

  test('should fail fetch pnpm with not found if proxy is down', async function () {
    const server2 = new ServerQuery(registry2.getRegistryUrl());
    (await server2.getPackage('pnpm')).status(HTTP_STATUS.NOT_FOUND);
  });

  test.skip('should fail with timeout', async function () {
    const server2 = new ServerQuery(registry2.getRegistryUrl());
    (await server2.getPackage('timeout-pkg')).status(HTTP_STATUS.SERVICE_UNAVAILABLE);
  }, 20000);

  afterAll(() => {
    registry.stop();
    registry2.stop();
    registry3.stop();
  });
});
