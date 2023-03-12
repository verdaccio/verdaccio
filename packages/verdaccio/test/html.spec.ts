import getPort from 'get-port';
import got from 'got';

import { ConfigBuilder } from '@verdaccio/config';
import { constants, fileUtils } from '@verdaccio/core';

import { Registry } from '../src/server';

describe('html', () => {
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

  test('should find html on root', async () => {
    const data = await got.get(`http://localhost:${registry.getPort()}`, {}).text();
    expect(data).toContain('<title>Verdaccio</title>');
  });
});
