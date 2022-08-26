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

  test('whoami', async () => {
    const server = new ServerQuery(registry.getRegistryUrl());
    // TODO: review this should be OK
    (await server.whoami()).status(HTTP_STATUS.UNAUTHORIZED);
    const q1 = await server.logout(registry.getToken());
    q1.status(HTTP_STATUS.OK);
  });
});
