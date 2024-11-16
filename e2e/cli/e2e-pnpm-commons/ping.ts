import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addRegistry, initialSetup } from '@verdaccio/test-cli-commons';

export function runPing(pnpm) {
  describe('ping registry', () => {
    let registry;

    beforeAll(async () => {
      const setup = await initialSetup();
      registry = setup.registry;
      await registry.init();
    });

    test('should ping registry', async () => {
      const resp = await pnpm({}, 'ping', '--json', ...addRegistry(registry.getRegistryUrl()));
      const parsedBody = JSON.parse(resp.stdout as string);
      expect(parsedBody.registry).toEqual(registry.getRegistryUrl() + '/');
    });

    afterAll(async () => {
      registry.stop();
    });
  });
}
