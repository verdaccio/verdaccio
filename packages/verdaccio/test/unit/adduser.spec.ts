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
          file: './htpasswd-user',
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

  test('add user', async () => {
    const server = new ServerQuery(registry.getRegistryUrl());
    (await server.createUser('foo', 'ramdomPassword')).status(HTTP_STATUS.CREATED);
  });

  test('user already exist', async () => {
    const server = new ServerQuery(registry.getRegistryUrl());
    (await server.createUser('foo2', 'ramdomPAssword')).status(HTTP_STATUS.CREATED);
    (await server.createUser('foo2', 'ramdomPAssword')).status(HTTP_STATUS.CONFLICT);
  });
});
