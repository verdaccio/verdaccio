import getPort from 'get-port';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { ConfigBuilder } from '@verdaccio/config';
import { API_MESSAGE, constants, fileUtils } from '@verdaccio/core';

import { Registry, ServerQuery } from '../src/server';

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
    const port = await getPort();
    registry = new Registry(configPath, { port });
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
        let message = success === 0 ? API_MESSAGE.PKG_CREATED : API_MESSAGE.PKG_CHANGED;
        await server.addPackage('race-pkg', `1.0.${time}`, message);
        success++;
      } catch (error) {
        console.error('this should not trigger', error);
      }
    }
    expect(success).toBe(times);
  }, 40000);
});
