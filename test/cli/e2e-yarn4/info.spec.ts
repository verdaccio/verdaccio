import { join } from 'path';

import { initialSetup, prepareYarnModernProject } from '@verdaccio/test-cli-commons';

import { getYarnCommand, yarn } from './utils';

describe('install a package', () => {
  jest.setTimeout(10000);
  let registry;
  let projectFolder;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
    const { tempFolder } = await prepareYarnModernProject(
      join(__dirname, './yarn-project'),
      'yarn-4',
      registry.getRegistryUrl(),
      getYarnCommand()
    );
    projectFolder = tempFolder;
  });

  test('should run yarn 4 info json body', async () => {
    const resp = await yarn(projectFolder, 'npm', 'info', 'verdaccio', '--json');
    const parsedBody = JSON.parse(resp.stdout as string);
    expect(parsedBody.name).toEqual('verdaccio');
    expect(parsedBody.dependencies).toBeDefined();
  });

  afterAll(async () => {
    registry.stop();
  });
});
