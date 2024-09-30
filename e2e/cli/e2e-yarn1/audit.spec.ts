import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';

import { yarn } from './utils';

describe('audit a package', () => {
  let registry;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
  });

  test.each([['verdaccio-memory', '@verdaccio/cli']])(
    'should audit a package %s',
    async (pkgName) => {
      const { tempFolder } = await prepareGenericEmptyProject(
        pkgName,
        '1.0.0-patch',
        registry.port,
        registry.getToken(),
        registry.getRegistryUrl(),
        { jquery: '3.6.1' }
      );
      // install is required to create package lock file
      await yarn({ cwd: tempFolder }, 'install', ...addRegistry(registry.getRegistryUrl()));
      const resp = await yarn(
        { cwd: tempFolder },
        'audit',
        '--json',
        ...addRegistry(registry.getRegistryUrl())
      );
      const parsedBody = JSON.parse(resp.stdout as string);
      expect(parsedBody.type).toEqual('auditSummary');
      expect(parsedBody.data.totalDependencies).toBeDefined();
      expect(parsedBody.data.dependencies).toBeDefined();
      expect(parsedBody.data.devDependencies).toBeDefined();
    }
  );

  afterAll(async () => {
    registry.stop();
  });
});
