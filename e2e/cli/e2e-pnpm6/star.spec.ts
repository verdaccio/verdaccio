import {
  addRegistry,
  initialSetup,
  pnpmUtils,
  prepareGenericEmptyProject,
} from '@verdaccio/test-cli-commons';

import { pnpm } from './utils';

describe('star a package', () => {
  jest.setTimeout(20000);
  let registry;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
  });

  test.each([['@verdaccio/foo']])('should star a package %s', async (pkgName) => {
    const { tempFolder } = await prepareGenericEmptyProject(
      pkgName,
      '1.0.0-patch',
      registry.port,
      registry.getToken(),
      registry.getRegistryUrl()
    );

    await pnpmUtils.publish(pnpm, tempFolder, pkgName, registry);
    const resp = await pnpm(
      { cwd: tempFolder },
      'star',
      pkgName,
      ...addRegistry(registry.getRegistryUrl())
    );
    expect(resp.stdout).toEqual(`★  ${pkgName}`);
  });

  test.each([['@verdaccio/bar']])('should unstar a package %s', async (pkgName) => {
    const { tempFolder } = await prepareGenericEmptyProject(
      pkgName,
      '1.0.0-patch',
      registry.port,
      registry.getToken(),
      registry.getRegistryUrl()
    );

    await pnpmUtils.publish(pnpm, tempFolder, pkgName, registry);
    const resp = await pnpm(
      { cwd: tempFolder },
      'star',
      pkgName,
      ...addRegistry(registry.getRegistryUrl())
    );
    expect(resp.stdout).toEqual(`★  ${pkgName}`);

    const resp1 = await pnpm(
      { cwd: tempFolder },
      'unstar',
      pkgName,
      ...addRegistry(registry.getRegistryUrl())
    );
    expect(resp1.stdout).toEqual(`☆  ${pkgName}`);
  });

  test('should list stars of a user %s', async () => {
    const pkgName = '@verdaccio/stars';
    const { tempFolder } = await prepareGenericEmptyProject(
      pkgName,
      '1.0.0-patch',
      registry.port,
      registry.getToken(),
      registry.getRegistryUrl()
    );
    await pnpmUtils.publish(pnpm, tempFolder, pkgName, registry);
    await pnpm({ cwd: tempFolder }, 'star', pkgName, ...addRegistry(registry.getRegistryUrl()));
    const resp = await pnpm(
      { cwd: tempFolder },
      'stars',
      ...addRegistry(registry.getRegistryUrl())
    );
    // side effects: this result is affected the the package published in the previous step
    expect(resp.stdout).toEqual(`@verdaccio/foo@verdaccio/stars`);
  });

  afterAll(async () => {
    registry.stop();
  });
});
