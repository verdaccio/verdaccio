import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';

import { yarn } from './utils';

describe('install a project packages', () => {
  jest.setTimeout(80000);
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
    const resp = await yarn(
      { cwd: tempFolder },
      'install',
      ...addRegistry(registry.getRegistryUrl())
    );
    expect(resp.stdout).toMatch(/success/);
  });

  afterAll(async () => {
    registry.stop();
  });
});
