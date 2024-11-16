import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addRegistry, initialSetup } from '@verdaccio/test-cli-commons';

export function runSearch(pnpm) {
  describe('search a package', () => {
    let registry;

    beforeAll(async () => {
      const setup = await initialSetup();
      registry = setup.registry;
      await registry.init();
    });

    test('should search a package', async () => {
      const resp = await pnpm(
        {},
        'search',
        '@verdaccio/cli',
        '--json',
        ...addRegistry(registry.getRegistryUrl())
      );
      const parsedBody = JSON.parse(resp.stdout as string);
      const pkgFind = parsedBody.find((item) => {
        return item.name === '@verdaccio/cli';
      });
      expect(pkgFind.name).toEqual('@verdaccio/cli');
    });

    afterAll(async () => {
      registry.stop();
    });
  });
}
