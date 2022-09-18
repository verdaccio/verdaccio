import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';

import { npm } from './utils';

describe('audit a package', () => {
  jest.setTimeout(10000);
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
      await npm({ cwd: tempFolder }, 'install', ...addRegistry(registry.getRegistryUrl()));
      const resp = await npm(
        { cwd: tempFolder },
        'audit',
        '--json',
        ...addRegistry(registry.getRegistryUrl())
      );
      const parsedBody = JSON.parse(resp.stdout as string);
      expect(parsedBody.metadata).toBeDefined();
      expect(parsedBody.auditReportVersion).toBeDefined();
      expect(parsedBody.vulnerabilities).toBeDefined();
    }
  );

  afterAll(async () => {
    registry.stop();
  });
});
