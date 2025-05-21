import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import {
  addRegistry,
  initialSetup,
  npmUtils,
  prepareGenericEmptyProject,
} from '@verdaccio/test-cli-commons';

export function runUnpublish(npm) {
  describe('unpublish a package', () => {
    let registry;

    beforeAll(async () => {
      const setup = await initialSetup();
      registry = setup.registry;
      await registry.init();
    });

    test.each([['@verdaccio/test1', 'super-package-do-not-exist-spam']])(
      'should unpublish a full package %s',
      async (pkgName) => {
        const { tempFolder } = await prepareGenericEmptyProject(
          pkgName,
          '1.0.0',
          registry.port,
          registry.getToken(),
          registry.getRegistryUrl()
        );
        await npmUtils.publish(npm, tempFolder, pkgName, registry);
        await npmUtils.bumpUpPackage(npm, tempFolder, pkgName, registry, ['minor']);
        await npmUtils.publish(npm, tempFolder, pkgName, registry);
        await npmUtils.bumpUpPackage(npm, tempFolder, pkgName, registry, ['minor']);
        await npmUtils.publish(npm, tempFolder, pkgName, registry);
        await npmUtils.bumpUpPackage(npm, tempFolder, pkgName, registry, ['major']);
        await npmUtils.publish(npm, tempFolder, pkgName, registry);

        const resp2 = await npm(
          { cwd: tempFolder },
          'unpublish',
          pkgName,
          '--force',
          '--loglevel=info',
          '--json',
          ...addRegistry(registry.getRegistryUrl())
        );
        expect(resp2.stdout).toEqual('- @verdaccio/test1');
      }
    );

    test.each([['@verdaccio/test1', 'super-package-do-not-exist-spam']])(
      'should unpublish a package %s version',
      async (pkgName) => {
        const { tempFolder } = await prepareGenericEmptyProject(
          pkgName,
          '1.0.0',
          registry.port,
          registry.getToken(),
          registry.getRegistryUrl()
        );
        await npmUtils.publish(npm, tempFolder, pkgName, registry);
        await npmUtils.bumpUpPackage(npm, tempFolder, pkgName, registry, ['minor']);
        await npmUtils.publish(npm, tempFolder, pkgName, registry);
        await npmUtils.bumpUpPackage(npm, tempFolder, pkgName, registry, ['minor']);
        await npmUtils.publish(npm, tempFolder, pkgName, registry);
        await npmUtils.bumpUpPackage(npm, tempFolder, pkgName, registry, ['major']);
        await npmUtils.publish(npm, tempFolder, pkgName, registry);

        const resp2 = await npm(
          { cwd: tempFolder },
          'unpublish',
          `${pkgName}@1.0.0`,
          '--force',
          '--loglevel=info',
          '--json',
          ...addRegistry(registry.getRegistryUrl())
        );
        expect(resp2.stdout).toEqual('- @verdaccio/test1@1.0.0');
      }
    );

    afterAll(async () => {
      registry.stop();
    });
  });
}
