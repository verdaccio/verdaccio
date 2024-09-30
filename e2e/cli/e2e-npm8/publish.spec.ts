import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';

import { npm } from './utils';

describe('install a package', () => {
  let registry;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
  });

  test.each([['verdaccio-memory', 'verdaccio', '@verdaccio/foo', '@verdaccio/some-foo']])(
    'should publish a package %s',
    async (pkgName) => {
      const { tempFolder } = await prepareGenericEmptyProject(
        pkgName,
        '1.0.0-patch',
        registry.port,
        registry.getToken(),
        registry.getRegistryUrl()
      );
      const resp = await npm(
        { cwd: tempFolder },
        'publish',
        '--json',
        ...addRegistry(registry.getRegistryUrl())
      );
      const parsedBody = JSON.parse(resp.stdout as string);
      expect(parsedBody.name).toEqual(pkgName);
      expect(parsedBody.files).toBeDefined();
      expect(parsedBody.files).toBeDefined();
    }
  );

  afterAll(async () => {
    registry.stop();
  });
});
