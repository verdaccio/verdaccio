import getPort from 'get-port';

import { ConfigBuilder } from '@verdaccio/config';
import { API_MESSAGE, HTTP_STATUS, constants, fileUtils } from '@verdaccio/core';

import { Registry, ServerQuery } from '../src/server';

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
    const port = await getPort();
    registry = new Registry(configPath, { port });
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

  describe('unpublish package', () => {
    test('shoud unpublish the whole package of many published', async function () {
      const server = new ServerQuery(registry.getRegistryUrl());
      await server.addPackage('unpublish-new-package', '1.0.0');
      await server.addPackage('unpublish-new-package', '1.0.1', API_MESSAGE.PKG_CHANGED);
      await server.addPackage('unpublish-new-package', '1.0.2', API_MESSAGE.PKG_CHANGED);
      (await server.getPackage('unpublish-new-package')).status(HTTP_STATUS.OK);
      (await server.removePackage('unpublish-new-package', '_rev')).status(HTTP_STATUS.CREATED);
      (await server.getPackage('unpublish-new-package')).status(HTTP_STATUS.NOT_FOUND);
      // FIXME: throws 500 instead 404
      // (await server.getTarball('unpublish-new-package', 'unpublish-new-package-1.0.0.tgz')).status(
      //   HTTP_STATUS.NOT_FOUND
      // );
    });
  });
});
