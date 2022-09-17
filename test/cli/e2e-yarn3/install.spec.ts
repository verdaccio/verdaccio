import { join } from 'path';

import { initialSetup, prepareYarnModernProject } from '@verdaccio/test-cli-commons';

import { getYarnCommand, yarn } from './utils';

describe('install a packages', () => {
  jest.setTimeout(10000);
  let registry;
  let projectFolder;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
    const { tempFolder } = await prepareYarnModernProject(
      join(__dirname, './yarn-install'),
      'yarn-2',
      registry.getRegistryUrl(),
      getYarnCommand()
    );
    projectFolder = tempFolder;
  });

  test('should run yarn npm audit info json body', async () => {
    const resp = await yarn(projectFolder, 'install');
    expect(resp.stdout).toMatch(/Completed➤ YN0000: Done in/);
  });

  afterAll(async () => {
    registry.stop();
  });
});
