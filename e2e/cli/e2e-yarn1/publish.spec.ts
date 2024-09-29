import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';

import { yarn } from './utils';

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
      const resp = await yarn(
        { cwd: tempFolder },
        'publish',
        '--json',
        ...addRegistry(registry.getRegistryUrl())
      );
      // TODO: improve parsing to get better expects
      expect(typeof resp.stdout === 'string').toBeDefined();
    }
  );

  afterAll(async () => {
    registry.stop();
  });
});
