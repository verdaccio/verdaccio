import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';

import { yarn } from './utils';

export async function bumbUp(tempFolder, registry) {
  await yarn({ cwd: tempFolder }, 'version', '--minor', ...addRegistry(registry.getRegistryUrl()));
}

describe('install a package', () => {
  let registry;

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
  });

  test.each([['@verdaccio/bar']])('should list tags of a package %s', async (pkgName) => {
    const { tempFolder } = await prepareGenericEmptyProject(
      pkgName,
      '1.0.0-patch',
      registry.port,
      registry.getToken(),
      registry.getRegistryUrl()
    );

    await yarn({ cwd: tempFolder }, 'publish', '--json', ...addRegistry(registry.getRegistryUrl()));

    const resp2 = await yarn(
      { cwd: tempFolder },
      'tag',
      'list',
      pkgName,
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );

    expect(resp2.stdout).toMatch(
      '{"type":"info","data":"Package @verdaccio%2fbar"}{"type":"info","data":"latest: 1.0.0-patch"}'
    );
  });

  test.each([['@verdaccio/foo']])('should add tag of a package %s', async (pkgName) => {
    const { tempFolder } = await prepareGenericEmptyProject(
      pkgName,
      '1.0.0',
      registry.port,
      registry.getToken(),
      registry.getRegistryUrl()
    );

    await yarn({ cwd: tempFolder }, 'publish', '--json', ...addRegistry(registry.getRegistryUrl()));
    await bumbUp(tempFolder, registry);
    await yarn({ cwd: tempFolder }, 'publish', '--json', ...addRegistry(registry.getRegistryUrl()));

    await yarn(
      { cwd: tempFolder },
      'tag',
      'add',
      `${pkgName}@1.0.0`,
      'beta',
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );

    const resp2 = await yarn(
      { cwd: tempFolder },
      'tag',
      'list',
      pkgName,
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );

    expect(resp2.stdout).toMatch(
      '{"type":"info","data":"Package @verdaccio%2ffoo"}{"type":"info","data":"latest: 1.1.0"}{"type":"info","data":"beta: 1.0.0"}'
    );
  });

  test.each([['@verdaccio/third']])('should remove tag of a package %s', async (pkgName) => {
    const { tempFolder } = await prepareGenericEmptyProject(
      pkgName,
      '1.0.0',
      registry.port,
      registry.getToken(),
      registry.getRegistryUrl()
    );

    await yarn({ cwd: tempFolder }, 'publish', '--json', ...addRegistry(registry.getRegistryUrl()));
    await bumbUp(tempFolder, registry);
    await yarn({ cwd: tempFolder }, 'publish', '--json', ...addRegistry(registry.getRegistryUrl()));

    await yarn(
      { cwd: tempFolder },
      'tag',
      'add',
      `${pkgName}@1.0.0`,
      'beta',
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );

    const resp2 = await yarn(
      { cwd: tempFolder },
      'tag',
      'list',
      pkgName,
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );

    expect(resp2.stdout).toMatch(
      '{"type":"info","data":"Package @verdaccio%2fthird"}{"type":"info","data":"latest: 1.1.0"}{"type":"info","data":"beta: 1.0.0"}'
    );

    const resp4 = await yarn(
      { cwd: tempFolder },
      'tag',
      'remove',
      pkgName,
      'beta',
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );
    expect(resp4.stdout).toMatch(
      '{"type":"step","data":{"message":"Deleting tag","current":2,"total":3}}{"type":"success","data":"Deleted tag."}'
    );

    const resp3 = await yarn(
      { cwd: tempFolder },
      'tag',
      'list',
      pkgName,
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );

    expect(resp3.stdout).toMatch(
      '{"type":"info","data":"Package @verdaccio%2fthird"}{"type":"info","data":"latest: 1.1.0"}'
    );
  });

  afterAll(async () => {
    registry.stop();
  });
});
