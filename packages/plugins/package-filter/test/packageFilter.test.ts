import { describe, expect, test } from 'vitest';

import { Dist, DistFile, Logger, Package, Version } from '@verdaccio/types';

import { CustomConfig } from '../src/config/types';
import PackageFilterPlugin from '../src/index';

const versionStub: Version = {
  _id: '',
  main: '',
  name: '',
  readme: '',
  version: '',
} as Version; // Some properties are omitted on purpose

const emptyPackage: Package = {} as Package;

const babelTestPackage: Package = {
  'dist-tags': { latest: '3.0.0' },
  _attachments: {},
  _distfiles: {},
  _rev: '',
  _uplinks: {},
  name: '@babel/test',
  versions: {
    '1.0.0': { ...versionStub, _id: '@babel/test@1.0.0' },
    '1.5.0': { ...versionStub, _id: '@babel/test@1.5.0' },
    '3.0.0': { ...versionStub, _id: '@babel/test@3.0.0' },
  },
  time: {
    modified: '2024-01-01T00:00:00.123Z',
    created: '2020-01-01T00:00:00.000Z',
    '1.0.0': '2020-01-01T00:00:00.000Z',
    '1.5.0': '2022-01-01T00:00:00.000Z',
    '3.0.0': '2024-01-01T00:00:00.000Z',
  },
  readme: 'It is a babel test package',
};

const typesNodePackage: Package = {
  'dist-tags': { latest: '2.6.3' },
  _attachments: {},
  _distfiles: {},
  _rev: '',
  _uplinks: {},
  name: '@types/node',
  versions: {
    '1.0.0': { ...versionStub, _id: '@types/node@1.0.0' },
    '2.2.0': { ...versionStub, _id: '@types/node@2.2.0' },
    '2.6.3': { ...versionStub, _id: '@types/node@2.6.3' },
  },
  time: {
    modified: '2025-01-01T00:00:00.456Z',
    created: '2010-01-01T00:00:00.000Z',
    '1.0.0': '2010-01-01T00:00:00.000Z',
    '2.2.0': '2015-01-01T00:00:00.000Z',
    '2.6.3': '2025-01-01T00:00:00.000Z',
  },
  readme: 'It is a types node package',
};

const testaccioPackage: Package = {
  'dist-tags': {
    latest: '1.7.0',
    beta: '1.7.1-beta',
    next: '2.2.1-next',
  },
  _attachments: {},
  _distfiles: {
    'testaccio-test-1.4.2.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.4.2.tgz',
    } as DistFile,
    'testaccio-test-1.4.4-beta.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.4.4-beta.tgz',
    } as DistFile,
    'testaccio-test-1.7.0.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.7.0.tgz',
    } as DistFile,
    'testaccio-test-1.7.1-beta.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.7.1-beta.tgz',
    } as DistFile,
    'testaccio-test-2.2.1-next.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-2.2.1-next.tgz',
    } as DistFile,
  },
  _rev: '',
  _uplinks: {},
  name: '@testaccio/test',
  versions: {
    '1.4.2': {
      ...versionStub,
      _id: '@testaccio/test@1.4.2',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.4.2.tgz',
      } as Dist,
    },
    '1.4.4-beta': {
      ...versionStub,
      _id: '@testaccio/test@1.4.4-beta',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.4.4-beta.tgz',
      } as Dist,
    },
    '1.7.0': {
      ...versionStub,
      _id: '@testaccio/test@1.7.0',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.7.0.tgz',
      } as Dist,
    },
    '1.7.1-beta': {
      ...versionStub,
      _id: '@testaccio/test@1.7.1-beta',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.7.1-beta.tgz',
      } as Dist,
    },
    '2.2.1-next': {
      ...versionStub,
      _id: '@testaccio/test@2.2.1-next',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-2.2.1-next.tgz',
      } as Dist,
    },
  },
  time: {
    modified: '2023-03-01T00:00:00.000Z',
    created: '2021-05-01T00:00:00.000Z',
    '1.4.2': '2021-05-01T00:00:00.000Z',
    '1.4.4-beta': '2021-06-01T00:00:00.000Z',
    '1.7.0': '2022-02-01T00:00:00.000Z',
    '1.7.1-beta': '2022-03-01T00:00:00.000Z',
    '2.2.1-next': '2023-03-01T00:00:00.000Z',
  },
  readme: 'It is a testaccio test package',
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};
const logger: Logger = {
  child: noop,
  debug: noop,
  error: noop,
  http: noop,
  warn: noop,
  info: noop,
  trace: noop,
  fatal: noop,
};

function getDaysSince(date: Date | string): number {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const ageMs = new Date().getTime() - date.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays;
}

describe('PackageFilterPlugin', () => {
  describe('date filtering', () => {
    test('filters by minAgeDays', async function () {
      const config = {
        minAgeDays: getDaysSince('2023'),
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should block 3.0.0 version of @babel/test
      expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

      // Should not block 2.6.3 version of @types/node
      expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
    });

    test('filters by dateThreshold', async function () {
      const config = {
        dateThreshold: '2023-01-01',
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should block 3.0.0 version of @babel/test
      expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

      // Should not block 2.6.3 version of @types/node
      expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
    });

    describe('dateThreshold combined with minAgeDays', () => {
      test("filters by minAgeDays when it's earlier than dateThreshold", async function () {
        const config = {
          minAgeDays: getDaysSince('2023-01-01'),
          dateThreshold: '2024-06-01',
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should block 3.0.0 version of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not block 2.6.3 version of @types/node
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test("filters by dateThreshold when it's earlier than minAgeDays", async function () {
        const config = {
          minAgeDays: getDaysSince('2024-06-01'),
          dateThreshold: '2023-01-01',
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should block 3.0.0 version of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not block 2.6.3 version of @types/node
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });
    });
  });

  describe('package and version filtering', () => {
    test('filters by scope', async function () {
      const config = {
        block: [{ scope: '@babel' }],
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should block all versions of @babel/test
      expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

      // Should not block @types/node
      expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
    });

    test('filters by package', async function () {
      const config = {
        block: [{ package: '@babel/test' }],
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should block all versions of @babel/test
      expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

      // Should not block @types/node
      expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
    });

    test('filters by versions', async function () {
      const config = {
        block: [{ package: '@babel/test', versions: '>1.0.0' }],
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should block all versions of @babel/test greater than 1.0.0
      expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

      // Should not block @types/node
      expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
    });

    test('filters by multiple versions', async function () {
      const config = {
        block: [
          { package: '@babel/test', versions: '>2.0.0' },
          { package: '@babel/test', versions: '<1.3.0' },
        ],
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should leave only 1.5.0 version of @babel/test
      expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

      // Should not block @types/node
      expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
    });

    test('replaces versions', async function () {
      const config = {
        block: [{ package: '@babel/test', versions: '>1.0.0', strategy: 'replace' }],
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should replace all versions of @babel/test greater than 1.0.0
      expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

      // Should not replace versions of @types/node
      expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
    });

    describe('readme stays intact when no filtering applied', () => {
      test('filter by versions', async function () {
        const config = {
          block: [{ package: '@babel/test', versions: '>10.0.0' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should not change anything
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();
      });

      test('version replacement', async function () {
        const config = {
          block: [{ package: '@babel/test', versions: '>10.0.0', strategy: 'replace' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should not change anything
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();
      });
    });
  });

  describe('whitelist', () => {
    describe('block by minAgeDays', () => {
      test('allow by scope', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [{ scope: '@babel' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [{ package: '@babel/test' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should block 2.0.0 version of @babel/test and unblock 3.0.0
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('multiple allow rules', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [
            { package: '@babel/test', versions: '3.0.0' },
            { package: '@types/node', versions: '>2.5.0' },
          ],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should block 2.0.0 version of @babel/test and unblock 3.0.0
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Version 2.6.3 should be unblocked
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });
    });

    describe('block by dateThreshold', () => {
      test('allow by scope', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [{ scope: '@babel' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [{ package: '@babel/test' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should block 2.0.0 version of @babel/test and unblock 3.0.0
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('multiple allow rules', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [
            { package: '@babel/test', versions: '3.0.0' },
            { package: '@types/node', versions: '>2.5.0' },
          ],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should block 2.0.0 version of @babel/test and unblock 3.0.0
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Version 2.6.3 should be unblocked
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });
    });

    describe('block by scope', () => {
      test('allow by scope', async function () {
        const config = {
          block: [{ scope: '@babel' }, { scope: '@types' }],
          allow: [{ scope: '@babel' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          block: [{ scope: '@babel' }, { scope: '@types' }],
          allow: [{ package: '@babel/test' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          block: [{ scope: '@babel' }, { scope: '@types' }],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock version 3.0.0 of @babel
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });
    });

    describe('block by package', () => {
      test('allow by scope', async function () {
        const config = {
          block: [{ package: '@babel/test' }, { package: '@types/node' }],
          allow: [{ scope: '@babel' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          block: [{ package: '@babel/test' }, { package: '@types/node' }],
          allow: [{ package: '@babel/test' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          block: [{ package: '@babel/test' }, { package: '@types/node' }],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock version 3.0.0 of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });
    });

    describe('block by version', () => {
      test('allow by scope', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>=1.5.0' },
            { package: '@types/node', versions: '>=2.2.0' },
          ],
          allow: [{ scope: '@babel' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>=1.5.0' },
            { package: '@types/node', versions: '>=2.2.0' },
          ],
          allow: [{ package: '@babel/test' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock all versions of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by versions', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>=1.5.0' },
            { package: '@types/node', versions: '>=2.2.0' },
          ],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should unblock version 3.0.0 of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });
    });

    describe('replace by version', () => {
      test('allow by scope', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>1.0.0', strategy: 'replace' },
            { package: '@types/node', versions: '>1.0.0', strategy: 'replace' },
          ],
          allow: [{ scope: '@babel' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should not replace versions of @babel
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should replace version of @types/node to 1.0.0
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>1.0.0', strategy: 'replace' },
            { package: '@types/node', versions: '>1.0.0', strategy: 'replace' },
          ],
          allow: [{ package: '@babel/test' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should not replace versions of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should replace version of @types/node to 1.0.0
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>1.0.0', strategy: 'replace' },
            { package: '@types/node', versions: '>1.0.0', strategy: 'replace' },
          ],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        } as CustomConfig; // Some properties are omitted on purpose
        const plugin = new PackageFilterPlugin(config, { logger, config });

        // Should only replace version 2.0.0 of @babel/test
        expect(await plugin.filter_metadata(babelTestPackage)).toMatchSnapshot();

        // Should replace version of @types/node to 1.0.0
        expect(await plugin.filter_metadata(typesNodePackage)).toMatchSnapshot();
      });
    });
  });

  describe('manifest cleanup', () => {
    test('latest tag is set to a latest stable version', async function () {
      const config = {
        block: [{ package: '@testaccio/test', versions: '1.7.0' }],
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should block '1.7.0' version of @testaccio/test
      // Should set 'latest' to '1.4.2', not to '1.4.4-beta' despite it is untagged
      expect(await plugin.filter_metadata(testaccioPackage)).toMatchSnapshot();
    });

    test('_distfiles are cleaned', async function () {
      const config = {
        block: [{ package: '@testaccio/test', versions: '1.7.0' }],
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should block '1.7.0' version of @testaccio/test
      // Should clean _distfiles['testaccio-test-1.7.0.tgz']
      expect(await plugin.filter_metadata(testaccioPackage)).toMatchSnapshot();
    });
  });

  describe('manifest validity', () => {
    test('empty package does not break the plugin', async function () {
      const config = {
        block: [{ package: 'some-package', versions: '7.7.7' }],
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // It's unlikely that Verdaccio will call this method with an empty package, but just in case
      expect(await plugin.filter_metadata(emptyPackage)).toMatchSnapshot();
    });

    test('_distfiles presence is not required', async function () {
      const config = {
        block: [{ package: '@testaccio/test', versions: '1.7.0' }],
      } as CustomConfig; // Some properties are omitted on purpose
      const plugin = new PackageFilterPlugin(config, { logger, config });

      // Should block '1.7.0' version of @testaccio/test
      // Should behave as if _distfiles were set to an empty object
      const packageWithNoDistFiles = { ...testaccioPackage } as { [key: string]: unknown };
      delete packageWithNoDistFiles._distfiles;

      // '_distfiles' may or may not be present in the package manifest,
      // it's a common thing when fetching data from a registry
      expect(
        await plugin.filter_metadata(packageWithNoDistFiles as unknown as Package)
      ).toMatchSnapshot();
    });
  });
});
