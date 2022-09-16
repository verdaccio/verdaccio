import { join } from 'path';

import { initialSetup, prepareYarnModernProject } from '@verdaccio/test-cli-commons';

import { getYarnCommand, yarn } from './utils';

describe('audit a package yarn 4', () => {
  jest.setTimeout(10000);
  let registry;
  let projectFolder;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
    const { tempFolder } = await prepareYarnModernProject(
      join(__dirname, './yarn-project'),
      'yarn-2',
      registry.getRegistryUrl(),
      getYarnCommand()
    );
    projectFolder = tempFolder;
  });

  test('should run yarn npm audit info json body', async () => {
    await yarn(projectFolder, 'install');
    const resp = await yarn(projectFolder, 'npm', 'audit', '--json');
    const parsedBody = JSON.parse(resp.stdout as string);
    expect(parsedBody.advisories).toBeDefined();
    expect(parsedBody.advisories['1069969']).toBeDefined();
    expect(parsedBody.advisories['1069969'].recommendation).toEqual(
      'Upgrade to version 3.4.0 or later'
    );
  });

  afterAll(async () => {
    registry.stop();
  });
});
