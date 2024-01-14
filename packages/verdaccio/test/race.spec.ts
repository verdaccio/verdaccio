import getPort from 'get-port';

import { ConfigBuilder } from '@verdaccio/config';
import { constants, fileUtils } from '@verdaccio/core';

import { Registry, ServerQuery } from '../src/server';

describe('race publishing packages', () => {
  let registry;

  // CI is slow, so we need to increase the timeout for the test.
  jest.setTimeout(40000);

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

  test('should fails 9 of 10 published packages', async () => {
    const server = new ServerQuery(registry.getRegistryUrl());
    const times = 10;
    let failures = 0;
    let success = 0;

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    for (const _time of Array.from(Array(times).keys())) {
      try {
        await server.addPackage('race-pkg', `1.0.0`);
        success++;
      } catch (error) {
        failures++;
      }
    }
    expect(failures).toBe(times - 1);
    expect(success).toBe(1);
  });
});
