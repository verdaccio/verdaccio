import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { initialSetup, yarnModernUtils } from '@verdaccio/test-cli-commons';

import { getYarnCommand, yarn } from './utils';

describe('audit a package yarn 3', () => {
  let registry;
  let projectFolder;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
    const { tempFolder } = await yarnModernUtils.prepareYarnModernProject(
      'yarn-3',
      registry.getRegistryUrl(),
      getYarnCommand(),
      {
        packageName: '@scope/name',
        version: '1.0.0',
        dependencies: { aaa: 'latest' },
        devDependencies: {},
      }
    );
    projectFolder = tempFolder;
  });

  test('should run yarn npm audit info json body', async () => {
    await yarn(projectFolder, 'install');
    // this might fails if the dependency used above has vulnerabilities
    // always try to use ar real dependency that does not have such issues
    // yarn berry uses exit 1 if has error https://github.com/yarnpkg/berry/pull/4358
    const resp = await yarn(projectFolder, 'npm', 'audit', '--json');
    const parsedBody = JSON.parse(resp.stdout as string);
    expect(parsedBody.advisories).toBeDefined();
  });

  afterAll(async () => {
    registry.stop();
  });
});
