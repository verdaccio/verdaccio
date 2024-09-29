import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { initialSetup, yarnModernUtils } from '@verdaccio/test-cli-commons';

import { getYarnCommand, yarn } from './utils';

describe('install a package', () => {
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
      }
    );
    projectFolder = tempFolder;
  });

  test('should run yarn 2 info json body', async () => {
    const resp = await yarn(projectFolder, 'npm', 'info', 'react', '--json');
    const parsedBody = JSON.parse(resp.stdout as string);
    expect(parsedBody.name).toEqual('react');
    expect(parsedBody.dependencies).toBeDefined();
  });

  afterAll(async () => {
    registry.stop();
  });
});
