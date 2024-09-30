import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { initialSetup, yarnModernUtils } from '@verdaccio/test-cli-commons';

import { getYarnCommand, yarn } from './utils';

describe('install a packages', () => {
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
        dependencies: { jquery: '3.6.0' },
        devDependencies: {},
      },
      registry.getToken()
    );
    projectFolder = tempFolder;
  });

  test('should run yarn publish', async () => {
    const resp = await yarn(projectFolder, 'install');
    expect(resp.stdout).toMatch(/Completed/);
    const resp1 = await yarn(projectFolder, 'npm', 'publish');
    expect(resp1.stdout).toMatch(/Package archive published/);
  });

  afterAll(async () => {
    registry.stop();
  });
});
