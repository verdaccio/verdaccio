import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { addRegistry, initialSetup, prepareGenericEmptyProject } from '@verdaccio/test-cli-commons';

export function runPublish(pnpm) {
  describe('publish a package', () => {
    let registry;

    beforeAll(async () => {
      const setup = await initialSetup();
      registry = setup.registry;
      await registry.init();
    });

    test.each([['verdaccio-memory', 'verdaccio', '@verdaccio/foo', '@verdaccio/some-foo']])(
      'should publish a package %s',
      async (pkgName) => {
        // As of npm v11, npm will fetch the packument from the npm registry before publishing (from the uplink),
        // and there are more checks in the client:
        // - "You cannot publish over the previously published versions"
        // - "You must specify a tag using --tag when publishing a prerelease version"
        // - "Cannot implicitly apply the 'latest' tag because previously published version x.y.z is higher than the new version a.b.c"
        // Therefore, we pick a version that is higher than any of the published versions for the test packages (and not a pre-release).
        const { tempFolder } = await prepareGenericEmptyProject(
          pkgName,
          '99.0.0',
          registry.port,
          registry.getToken(),
          registry.getRegistryUrl()
        );
        const resp = await pnpm(
          { cwd: tempFolder },
          'publish',
          '--json',
          ...addRegistry(registry.getRegistryUrl())
        );
        const parsedBody = JSON.parse(resp.stdout as string);
        expect(parsedBody.name).toEqual(pkgName);
        expect(parsedBody.files).toBeDefined();
      }
    );

    afterAll(async () => {
      registry.stop();
    });
  });
}
