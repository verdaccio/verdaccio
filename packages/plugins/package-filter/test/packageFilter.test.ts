import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';
import type { Manifest } from '@verdaccio/types';

import PackageFilterPlugin from '../src/index';
import {
  babelTestManifest,
  emptyManifest,
  testaccioManifest,
  typesNodeManifest,
} from './manifests';

setup({});

const verdaccioConfig = new Config(
  parseConfigFile(path.join(__dirname, '__fixtures__', 'config.yaml'))
);
const pluginOptions = { logger, config: verdaccioConfig };

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
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block 3.0.0 version of @babel/test
      expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

      // Should not block 2.6.3 version of @types/node
      expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
    });

    test('filters by dateThreshold', async function () {
      const config = {
        dateThreshold: '2023-01-01',
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block 3.0.0 version of @babel/test
      expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

      // Should not block 2.6.3 version of @types/node
      expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
    });

    describe('dateThreshold combined with minAgeDays', () => {
      test("filters by minAgeDays when it's earlier than dateThreshold", async function () {
        const config = {
          minAgeDays: getDaysSince('2023-01-01'),
          dateThreshold: '2024-06-01',
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 3.0.0 version of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not block 2.6.3 version of @types/node
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test("filters by dateThreshold when it's earlier than minAgeDays", async function () {
        const config = {
          minAgeDays: getDaysSince('2024-06-01'),
          dateThreshold: '2023-01-01',
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 3.0.0 version of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not block 2.6.3 version of @types/node
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });
    });
  });

  describe('package and version filtering', () => {
    test('filters by scope', async function () {
      const config = {
        block: [{ scope: '@babel' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block all versions of @babel/test
      expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

      // Should not block @types/node
      expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
    });

    test('filters by package', async function () {
      const config = {
        block: [{ package: '@babel/test' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block all versions of @babel/test
      expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

      // Should not block @types/node
      expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
    });

    test('filters by versions', async function () {
      const config = {
        block: [{ package: '@babel/test', versions: '>1.0.0' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block all versions of @babel/test greater than 1.0.0
      expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

      // Should not block @types/node
      expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
    });

    test('filters by multiple versions', async function () {
      const config = {
        block: [
          { package: '@babel/test', versions: '>2.0.0' },
          { package: '@babel/test', versions: '<1.3.0' },
        ],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should leave only 1.5.0 version of @babel/test
      expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

      // Should not block @types/node
      expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
    });

    test('replaces versions', async function () {
      const config = {
        block: [{ package: '@babel/test', versions: '>1.0.0', strategy: 'replace' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should replace all versions of @babel/test greater than 1.0.0
      expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

      // Should not replace versions of @types/node
      expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
    });

    describe('readme stays intact when no filtering applied', () => {
      test('filter by versions', async function () {
        const config = {
          block: [{ package: '@babel/test', versions: '>10.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should not change anything
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();
      });

      test('version replacement', async function () {
        const config = {
          block: [{ package: '@babel/test', versions: '>10.0.0', strategy: 'replace' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should not change anything
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();
      });
    });
  });

  describe('whitelist', () => {
    describe('block by minAgeDays', () => {
      test('allow by scope', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [{ scope: '@babel' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 2.0.0 version of @babel/test and unblock 3.0.0
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('multiple allow rules', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [
            { package: '@babel/test', versions: '3.0.0' },
            { package: '@types/node', versions: '>2.5.0' },
          ],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 2.0.0 version of @babel/test and unblock 3.0.0
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Version 2.6.3 should be unblocked
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });
    });

    describe('block by dateThreshold', () => {
      test('allow by scope', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [{ scope: '@babel' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 2.0.0 version of @babel/test and unblock 3.0.0
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types. Version 2.6.3 should be blocked.
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('multiple allow rules', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [
            { package: '@babel/test', versions: '3.0.0' },
            { package: '@types/node', versions: '>2.5.0' },
          ],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 2.0.0 version of @babel/test and unblock 3.0.0
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Version 2.6.3 should be unblocked
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });
    });

    describe('block by scope', () => {
      test('allow by scope', async function () {
        const config = {
          block: [{ scope: '@babel' }, { scope: '@types' }],
          allow: [{ scope: '@babel' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          block: [{ scope: '@babel' }, { scope: '@types' }],
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          block: [{ scope: '@babel' }, { scope: '@types' }],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock version 3.0.0 of @babel
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });
    });

    describe('block by package', () => {
      test('allow by scope', async function () {
        const config = {
          block: [{ package: '@babel/test' }, { package: '@types/node' }],
          allow: [{ scope: '@babel' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          block: [{ package: '@babel/test' }, { package: '@types/node' }],
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          block: [{ package: '@babel/test' }, { package: '@types/node' }],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock version 3.0.0 of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
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
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>=1.5.0' },
            { package: '@types/node', versions: '>=2.2.0' },
          ],
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by versions', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>=1.5.0' },
            { package: '@types/node', versions: '>=2.2.0' },
          ],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock version 3.0.0 of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should not unblock @types/node
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
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
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should not replace versions of @babel
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should replace version of @types/node to 1.0.0
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by package', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>1.0.0', strategy: 'replace' },
            { package: '@types/node', versions: '>1.0.0', strategy: 'replace' },
          ],
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should not replace versions of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should replace version of @types/node to 1.0.0
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });

      test('allow by version', async function () {
        const config = {
          block: [
            { package: '@babel/test', versions: '>1.0.0', strategy: 'replace' },
            { package: '@types/node', versions: '>1.0.0', strategy: 'replace' },
          ],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should only replace version 2.0.0 of @babel/test
        expect(await plugin.filter_metadata(babelTestManifest)).toMatchSnapshot();

        // Should replace version of @types/node to 1.0.0
        expect(await plugin.filter_metadata(typesNodeManifest)).toMatchSnapshot();
      });
    });
  });

  describe('manifest cleanup', () => {
    test('latest tag is set to a latest stable version', async function () {
      const config = {
        block: [{ package: '@testaccio/test', versions: '1.7.0' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block '1.7.0' version of @testaccio/test
      // Should set 'latest' to '1.4.2', not to '1.4.4-beta' despite it is untagged
      expect(await plugin.filter_metadata(testaccioManifest)).toMatchSnapshot();
    });

    test('_distfiles are cleaned', async function () {
      const config = {
        block: [{ package: '@testaccio/test', versions: '1.7.0' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block '1.7.0' version of @testaccio/test
      // Should clean _distfiles['testaccio-test-1.7.0.tgz']
      expect(await plugin.filter_metadata(testaccioManifest)).toMatchSnapshot();
    });
  });

  describe('manifest validity', () => {
    test('empty package does not break the plugin', async function () {
      const config = {
        block: [{ package: 'some-package', versions: '7.7.7' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // It's unlikely that Verdaccio will call this method with an empty package, but just in case
      expect(await plugin.filter_metadata(emptyManifest)).toMatchSnapshot();
    });

    test('_distfiles presence is not required', async function () {
      const config = {
        block: [{ package: '@testaccio/test', versions: '1.7.0' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block '1.7.0' version of @testaccio/test
      // Should behave as if _distfiles were set to an empty object
      const packageWithNoDistFiles = { ...testaccioManifest } as { [key: string]: unknown };
      delete packageWithNoDistFiles._distfiles;

      // '_distfiles' may or may not be present in the package manifest,
      // it's a common thing when fetching data from a registry
      expect(
        await plugin.filter_metadata(packageWithNoDistFiles as unknown as Manifest)
      ).toMatchSnapshot();
    });
  });
});
