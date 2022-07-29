import { ConfigBuilder } from '@verdaccio/config';
import { constants, fileUtils } from '@verdaccio/core';

import { Registry, ServerQuery } from '../../src/server';

describe('race publishing packages', () => {
  let registry;

  beforeAll(async function () {
    const storage = await fileUtils.createTempStorageFolder('race-test');
    const configuration = ConfigBuilder.build()
      .addStorage(storage)
      .addPackageAccess(constants.PACKAGE_ACCESS.ALL, {
        access: constants.ROLES.$ALL,
        publish: constants.ROLES.$ALL,
      })
      .addAuth({
        htpasswd: {
          file: './htpasswd-race',
        },
      })
      .addLogger({ level: 'warn', type: 'stdout', format: 'pretty' })
      .addUplink('upstream', { url: 'https://registry.verdaccio.org' });
    const { configPath } = await Registry.fromConfigToPath(configuration.getConfig());
    registry = new Registry(configPath);
    await registry.init();
  });

  afterAll(() => {
    registry.stop();
  });

  test('should publish multiple packages', async () => {
    const server = new ServerQuery(registry.getRegistryUrl());
    const times = 100;
    let success = 0;

    for (const time of Array.from(Array(times).keys())) {
      try {
        await server.addPackage('race-pkg', `1.0.${time}`);
        success++;
      } catch (error) {
        console.error('this should not trigger', error);
      }
    }
    expect(success).toBe(times);
  }, 30000);
});
