import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import {
  addRegistry,
  initialSetup,
  npmUtils,
  prepareGenericEmptyProject,
} from '@verdaccio/test-cli-commons';

import { npm } from './utils';

describe('deprecate a package', () => {
  let registry;

  async function deprecate(tempFolder, packageVersion, registry, message) {
    await npm(
      { cwd: tempFolder },
      'deprecate',
      packageVersion,
      message,
      '--json',
      ...addRegistry(registry.getRegistryUrl())
    );
  }

  beforeAll(async () => {
    const setup = await initialSetup();
    registry = setup.registry;
    await registry.init();
  });

  test.each([['@verdaccio/deprecated-1']])(
    'should deprecate a single package %s',
    async (pkgName) => {
      const message = 'some message';
      const { tempFolder } = await prepareGenericEmptyProject(
        pkgName,
        '1.0.0',
        registry.port,
        registry.getToken(),
        registry.getRegistryUrl()
      );
      await npmUtils.publish(npm, tempFolder, pkgName, registry);
      // deprecate one version
      await deprecate(tempFolder, `${pkgName}@1.0.0`, registry, message);
      // verify is deprecated
      const infoBody = await npmUtils.getInfoVersions(npm, `${pkgName}`, registry);
      expect(infoBody.name).toEqual(pkgName);
      expect(infoBody.deprecated).toEqual(message);
    }
  );

  test.each([['@verdaccio/deprecated-2']])('should un-deprecate a package %s', async (pkgName) => {
    const message = 'some message';
    const { tempFolder } = await prepareGenericEmptyProject(
      pkgName,
      '1.0.0',
      registry.port,
      registry.getToken(),
      registry.getRegistryUrl()
    );
    await npmUtils.publish(npm, tempFolder, pkgName, registry);
    // deprecate one version
    await deprecate(tempFolder, `${pkgName}@1.0.0`, registry, message);
    // verify is deprecated
    const infoBody = await npmUtils.getInfoVersions(npm, `${pkgName}`, registry);
    expect(infoBody.deprecated).toEqual(message);
    // empty string is same as undeprecate
    await deprecate(tempFolder, `${pkgName}@1.0.0`, registry, '');
    const infoBody2 = await npmUtils.getInfoVersions(npm, `${pkgName}`, registry);
    expect(infoBody2.deprecated).toBeUndefined();
  });

  test.each([['@verdaccio/deprecated-3']])(
    'should deprecate a multiple packages %s',
    async (pkgName) => {
      const message = 'some message';
      const { tempFolder } = await prepareGenericEmptyProject(
        pkgName,
        '1.0.0',
        registry.port,
        registry.getToken(),
        registry.getRegistryUrl()
      );
      // publish 1.0.0
      await npmUtils.publish(npm, tempFolder, pkgName, registry);
      // publish 1.1.0
      await npmUtils.bumbUp(npm, tempFolder, registry);
      await npmUtils.publish(npm, tempFolder, pkgName, registry);
      // publish 1.2.0
      await npmUtils.bumbUp(npm, tempFolder, registry);
      await npmUtils.publish(npm, tempFolder, pkgName, registry);
      // publish 1.3.0
      await npmUtils.bumbUp(npm, tempFolder, registry);
      await npmUtils.publish(npm, tempFolder, pkgName, registry);
      // // deprecate all version
      await deprecate(tempFolder, pkgName, registry, message);
      // verify is deprecated
      for (let v of ['1.0.0', '1.1.0', '1.2.0', '1.3.0']) {
        const infoResp = await npmUtils.getInfoVersions(npm, `${pkgName}@${v}`, registry);
        expect(infoResp.deprecated).toEqual(message);
      }
      // publish normal version
      // publish 1.4.0
      await npmUtils.bumbUp(npm, tempFolder, registry);
      await npmUtils.publish(npm, tempFolder, pkgName, registry);
      const infoResp = await npmUtils.getInfoVersions(npm, `${pkgName}@1.4.0`, registry);
      // must be not deprecated
      expect(infoResp.deprecated).toBeUndefined();
    }
  );

  afterAll(async () => {
    registry.stop();
  });
});
