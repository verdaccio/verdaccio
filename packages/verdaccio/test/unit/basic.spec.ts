import { ConfigBuilder } from '@verdaccio/config';
import { HTTP_STATUS, constants, fileUtils } from '@verdaccio/core';

import { Registry, ServerQuery } from '../../src/server';

describe('basic test endpoints', () => {
  let registry;

  beforeAll(async function () {
    const storage = await fileUtils.createTempStorageFolder('basic-test');
    const configuration = ConfigBuilder.build()
      .addStorage(storage)
      .addPackageAccess(constants.PACKAGE_ACCESS.ALL, {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$ALL,
      })
      .addAuth({
        htpasswd: {
          file: './htpasswd',
        },
      })
      .addLogger({ level: 'debug', type: 'stdout', format: 'pretty' })
      .addUplink('upstream', { url: 'https://registry.verdaccio.org' });
    const { configPath } = await Registry.fromConfigToPath(configuration.getConfig());
    registry = new Registry(configPath);
    await registry.init();
  });

  afterAll(() => {
    registry.stop();
  });

  describe('server health', () => {
    test('ping', async () => {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.ping();
    });
  });

  describe('publish package', () => {
    test('should create a package', async function () {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.addPackage('testpkg-single-tarball-1');
    });

    test('should create a scoped package', async function () {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.addPackage('@private/pkg1');
    });

    test('should create new versions', async function () {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.addPackage('testpkg-single-tarball-2');
      await server.addPackage('testpkg-single-tarball', '1.0.1');
    });

    test('should have a package conflict', async function () {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.addPackage('testpkg-single-tarball-3', '1.0.0');
      await (
        await server.addPackageAssert('testpkg-single-tarball-3', '1.0.0')
      ).status(HTTP_STATUS.CONFLICT);
    });
  });

  describe('unpublish package', () => {
    test('shoud unpublish the whole package of many published', async function () {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.addPackage('unpublish-new-package', '1.0.0');
      await server.addPackage('unpublish-new-package', '1.0.1');
      await server.addPackage('unpublish-new-package', '1.0.2');
      (await server.getPackage('unpublish-new-package')).status(HTTP_STATUS.OK);
      (await server.removePackage('unpublish-new-package', '_rev')).status(HTTP_STATUS.CREATED);
      (await server.getPackage('unpublish-new-package')).status(HTTP_STATUS.NOT_FOUND);
      // FIXME: throws 500 instead 404
      // (await server.getTarball('unpublish-new-package', 'unpublish-new-package-1.0.0.tgz')).status(
      //   HTTP_STATUS.NOT_FOUND
      // );
    });
  });

  describe('get packages', () => {
    test('should get a private package', async function () {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.addPackage('new-package', '1.0.0');
      (await server.getPackage('new-package')).status(200);
      (await server.getTarball('new-package', 'new-package-1.0.0.tgz')).status(HTTP_STATUS.OK);
    });

    test('should get error on wrong a private package', async function () {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.addPackage('non-exist-package', '1.0.0');
      (await server.getPackage('non-exist-package')).status(HTTP_STATUS.OK);
      (await server.getTarball('non-exist-package', 'non-exist-package-1.0.1.tgz')).status(
        HTTP_STATUS.NOT_FOUND
      );
    });
  });

  describe('get tarball', () => {
    test('should get a fetch a tarball', async function () {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.addPackage('new-package-tarball', '1.0.0');
      (await server.getPackage('new-package-tarball')).status(200);
      (await server.getTarball('new-package-tarball', 'new-package-tarball-1.0.0.tgz')).status(
        HTTP_STATUS.OK
      );
    });
  });
});
