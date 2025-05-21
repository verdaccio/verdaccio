import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import {
  addRegistry,
  initialSetup,
  npmUtils,
  prepareGenericEmptyProject,
} from '@verdaccio/test-cli-commons';

export function runStar(npm) {
  describe('star a package', () => {
    let registry;

    beforeAll(async () => {
      const setup = await initialSetup();
      registry = setup.registry;
      await registry.init();
    });

    test.each([['@verdaccio/foo']])('should star a package %s', async (pkgName) => {
      const { tempFolder } = await prepareGenericEmptyProject(
        pkgName,
        '1.0.0',
        registry.port,
        registry.getToken(),
        registry.getRegistryUrl()
      );

      await npmUtils.publish(npm, tempFolder, pkgName, registry);
      const resp = await npm(
        { cwd: tempFolder },
        'star',
        pkgName,
        ...addRegistry(registry.getRegistryUrl())
      );
      expect(resp.stdout).toEqual(`★  ${pkgName}`);
    });

    test.each([['@verdaccio/bar']])('should unstar a package %s', async (pkgName) => {
      const { tempFolder } = await prepareGenericEmptyProject(
        pkgName,
        '1.0.0',
        registry.port,
        registry.getToken(),
        registry.getRegistryUrl()
      );

      await npmUtils.publish(npm, tempFolder, pkgName, registry);
      const resp = await npm(
        { cwd: tempFolder },
        'star',
        pkgName,
        ...addRegistry(registry.getRegistryUrl())
      );
      expect(resp.stdout).toEqual(`★  ${pkgName}`);

      const resp1 = await npm(
        { cwd: tempFolder },
        'unstar',
        pkgName,
        ...addRegistry(registry.getRegistryUrl())
      );
      expect(resp1.stdout).toEqual(`☆  ${pkgName}`);
    });

    test('should list stars of a user %s', async () => {
      const pkgName = '@verdaccio/stars';
      const { tempFolder } = await prepareGenericEmptyProject(
        pkgName,
        '1.0.0',
        registry.port,
        registry.getToken(),
        registry.getRegistryUrl()
      );
      await npmUtils.publish(npm, tempFolder, pkgName, registry);
      await npm({ cwd: tempFolder }, 'star', pkgName, ...addRegistry(registry.getRegistryUrl()));
      const resp = await npm(
        { cwd: tempFolder },
        'stars',
        ...addRegistry(registry.getRegistryUrl())
      );
      // side effects: this result is affected the the package published in the previous step
      expect(resp.stdout).toEqual(`@verdaccio/foo@verdaccio/stars`);
    });

    afterAll(async () => {
      registry.stop();
    });
  });
}
