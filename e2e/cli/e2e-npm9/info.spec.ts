import { addRegistry, initialSetup } from '@verdaccio/test-cli-commons';

import { npm } from './utils';

describe('install a package', () => {
  jest.setTimeout(10000);
  let registry;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
  });

  test('should run npm info json body', async () => {
    const resp = await npm(
      {},
      'info',
      'verdaccio',
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );
    const parsedBody = JSON.parse(resp.stdout as string);
    expect(parsedBody.name).toEqual('verdaccio');
    expect(parsedBody.dependencies).toBeDefined();
  });

  afterAll(async () => {
    registry.stop();
  });
});
