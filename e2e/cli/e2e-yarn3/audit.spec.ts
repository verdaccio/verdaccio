import { initialSetup, yarnModernUtils } from '@verdaccio/test-cli-commons';

import { getYarnCommand, yarn } from './utils';

describe('audit a package yarn 3', () => {
  jest.setTimeout(10000);
  let registry;
  let projectFolder;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
    const { tempFolder } = await yarnModernUtils.prepareYarnModernProject(
      'yarn-2',
      registry.getRegistryUrl(),
      getYarnCommand(),
      {
        packageName: '@scope/name',
        version: '1.0.0',
        dependencies: { jquery: '3.0.0' },
        devDependencies: {},
      }
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
