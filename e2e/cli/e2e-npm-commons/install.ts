import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';

export function runInstall(npm) {
  describe('install a project packages', () => {
    let registry;

    beforeAll(async () => {
      const setup = await initialSetup();
      registry = setup.registry;
      await registry.init();
    });

    test('should run npm install json body', async () => {
      const { tempFolder } = await prepareGenericEmptyProject(
        'something',
        '1.0.0-patch',
        registry.port,
        registry.getToken(),
        registry.getRegistryUrl(),
        { react: '18.2.0' }
      );
      const resp = await npm(
        { cwd: tempFolder },
        'install',
        '--json',
        ...addRegistry(registry.getRegistryUrl())
      );
      const parsedBody = JSON.parse(resp.stdout as string);
      expect(parsedBody.added).toBeDefined();
      expect(parsedBody.audit).toBeDefined();
    });

    afterAll(async () => {
      registry.stop();
    });
  });
}
