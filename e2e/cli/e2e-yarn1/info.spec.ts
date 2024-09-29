import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addRegistry, initialSetup } from '@verdaccio/test-cli-commons';

import { yarn } from './utils';

describe('install a package', () => {
  let registry;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
  });

  test('should run yarn info json body', async () => {
    const resp = await yarn(
      {},
      'info',
      'verdaccio',
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );

    const parsedBody = JSON.parse(resp.stdout as string);
    expect(parsedBody.data.name).toEqual('verdaccio');
    expect(parsedBody.data.dependencies).toBeDefined();
  });

  afterAll(async () => {
    registry.stop();
  });
});
