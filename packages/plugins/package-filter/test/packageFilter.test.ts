import path from 'node:path';
import { beforeAll, describe, expect, test } from 'vitest';

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

let pluginOptions: { logger: any; config: Config };

beforeAll(async () => {
  await setup({});
  const verdaccioConfig = new Config(
    parseConfigFile(path.join(import.meta.dirname, '__fixtures__', 'config.yaml'))
  );
  pluginOptions = { logger, config: verdaccioConfig };
});

function getDaysSince(date: Date | string): number {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const ageMs = new Date().getTime() - date.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays;
}

function getVersionKeys(result: Manifest): string[] {
  return Object.keys(result.versions ?? {}).sort();
}

function getLatest(result: Manifest): string | undefined {
  return result['dist-tags']?.latest;
}

describe('PackageFilterPlugin', () => {
  describe('date filtering', () => {
    test('filters by minAgeDays', async function () {
      const config = {
        // Only allow versions published before 2023-01-01
        minAgeDays: getDaysSince('2023'),
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block 3.0.0 version of @babel/test
      const babelResult = await plugin.filter_metadata(babelTestManifest);
      expect(getVersionKeys(babelResult)).not.toContain('3.0.0');
      expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0']);
      expect(getLatest(babelResult)).toBe('1.5.0');

      // Should block 2.6.3 version of @types/node (published 2025, after 2023 threshold)
      const typesResult = await plugin.filter_metadata(typesNodeManifest);
      expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
      expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
      expect(getLatest(typesResult)).toBe('2.2.0');
    });

    test('filters by dateThreshold', async function () {
      const config = {
        dateThreshold: '2023-01-01',
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block 3.0.0 version of @babel/test
      const babelResult = await plugin.filter_metadata(babelTestManifest);
      expect(getVersionKeys(babelResult)).not.toContain('3.0.0');
      expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0']);
      expect(getLatest(babelResult)).toBe('1.5.0');

      // Should block 2.6.3 version of @types/node (published 2025, after 2023 threshold)
      const typesResult = await plugin.filter_metadata(typesNodeManifest);
      expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
      expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
      expect(getLatest(typesResult)).toBe('2.2.0');
    });

    describe('dateThreshold combined with minAgeDays', () => {
      test("filters by minAgeDays when it's earlier than dateThreshold", async function () {
        const config = {
          minAgeDays: getDaysSince('2023-01-01'),
          dateThreshold: '2024-06-01',
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 3.0.0 version of @babel/test
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).not.toContain('3.0.0');
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0']);
        expect(getLatest(babelResult)).toBe('1.5.0');

        // Should block 2.6.3 version of @types/node (published 2025, after 2023 threshold)
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
        expect(getLatest(typesResult)).toBe('2.2.0');
      });

      test("filters by dateThreshold when it's earlier than minAgeDays", async function () {
        const config = {
          minAgeDays: getDaysSince('2024-06-01'),
          dateThreshold: '2023-01-01',
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 3.0.0 version of @babel/test
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).not.toContain('3.0.0');
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0']);
        expect(getLatest(babelResult)).toBe('1.5.0');

        // Should block 2.6.3 version of @types/node (published 2025, after 2023 threshold)
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
        expect(getLatest(typesResult)).toBe('2.2.0');
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
      const babelResult = await plugin.filter_metadata(babelTestManifest);
      expect(getVersionKeys(babelResult)).toEqual([]);
      expect(babelResult.readme).toContain('blocked by rule');

      // Should not block @types/node
      const typesResult = await plugin.filter_metadata(typesNodeManifest);
      expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
      expect(getLatest(typesResult)).toBe('2.6.3');
    });

    test('filters by package', async function () {
      const config = {
        block: [{ package: '@babel/test' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block all versions of @babel/test
      const babelResult = await plugin.filter_metadata(babelTestManifest);
      expect(getVersionKeys(babelResult)).toEqual([]);
      expect(babelResult.readme).toContain('blocked by rule');

      // Should not block @types/node
      const typesResult = await plugin.filter_metadata(typesNodeManifest);
      expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
      expect(getLatest(typesResult)).toBe('2.6.3');
    });

    test('filters by versions', async function () {
      const config = {
        block: [{ package: '@babel/test', versions: '>1.0.0' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block all versions of @babel/test greater than 1.0.0
      const babelResult = await plugin.filter_metadata(babelTestManifest);
      expect(getVersionKeys(babelResult)).not.toContain('1.5.0');
      expect(getVersionKeys(babelResult)).not.toContain('3.0.0');
      expect(getVersionKeys(babelResult)).toEqual(['1.0.0']);
      expect(getLatest(babelResult)).toBe('1.0.0');

      // Should not block @types/node
      const typesResult = await plugin.filter_metadata(typesNodeManifest);
      expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
      expect(getLatest(typesResult)).toBe('2.6.3');
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
      const babelResult = await plugin.filter_metadata(babelTestManifest);
      expect(getVersionKeys(babelResult)).not.toContain('1.0.0');
      expect(getVersionKeys(babelResult)).not.toContain('3.0.0');
      expect(getVersionKeys(babelResult)).toEqual(['1.5.0']);
      expect(getLatest(babelResult)).toBe('1.5.0');

      // Should not block @types/node
      const typesResult = await plugin.filter_metadata(typesNodeManifest);
      expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
      expect(getLatest(typesResult)).toBe('2.6.3');
    });

    test('replaces versions', async function () {
      const config = {
        block: [{ package: '@babel/test', versions: '>1.0.0', strategy: 'replace' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should replace all versions of @babel/test greater than 1.0.0
      const babelResult = await plugin.filter_metadata(babelTestManifest);
      expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
      expect(getLatest(babelResult)).toBe('3.0.0');
      // Replaced versions should point to 1.0.0
      expect(babelResult.versions['1.5.0']._id).toBe('@babel/test@1.0.0');
      expect(babelResult.versions['3.0.0']._id).toBe('@babel/test@1.0.0');
      expect(babelResult.readme).toContain('replaced');

      // Should not replace versions of @types/node
      const typesResult = await plugin.filter_metadata(typesNodeManifest);
      expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
      expect(typesResult.versions['1.0.0']._id).toBe('@types/node@1.0.0');
      expect(typesResult.versions['2.2.0']._id).toBe('@types/node@2.2.0');
      expect(typesResult.versions['2.6.3']._id).toBe('@types/node@2.6.3');
      expect(getLatest(typesResult)).toBe('2.6.3');
    });

    describe('readme stays intact when no filtering applied', () => {
      test('filter by versions', async function () {
        const config = {
          block: [{ package: '@babel/test', versions: '>10.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should not change anything
        const result = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(result)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(result)).toBe('3.0.0');
        expect(result.readme).toBe('It is a babel test package');
      });

      test('version replacement', async function () {
        const config = {
          block: [{ package: '@babel/test', versions: '>10.0.0', strategy: 'replace' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should not change anything
        const result = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(result)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(result)).toBe('3.0.0');
        expect(result.readme).toBe('It is a babel test package');
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
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types. Version 2.6.3 should be blocked.
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
        expect(getLatest(typesResult)).toBe('2.2.0');
      });

      test('allow by package', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel/test
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types. Version 2.6.3 should be blocked.
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
        expect(getLatest(typesResult)).toBe('2.2.0');
      });

      test('allow by version', async function () {
        const config = {
          minAgeDays: getDaysSince('2021'),
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 1.5.0 version of @babel/test and unblock 3.0.0
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).not.toContain('1.5.0');
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types. Version 2.6.3 should be blocked.
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
        expect(getLatest(typesResult)).toBe('2.2.0');
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

        // Should block 1.5.0 version of @babel/test and unblock 3.0.0
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).not.toContain('1.5.0');
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Version 2.6.3 should be unblocked
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
        expect(getLatest(typesResult)).toBe('2.6.3');
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
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types. Version 2.6.3 should be blocked.
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
        expect(getLatest(typesResult)).toBe('2.2.0');
      });

      test('allow by package', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel/test
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types. Version 2.6.3 should be blocked.
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
        expect(getLatest(typesResult)).toBe('2.2.0');
      });

      test('allow by version', async function () {
        const config = {
          dateThreshold: '2021',
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should block 1.5.0 version of @babel/test and unblock 3.0.0
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).not.toContain('1.5.0');
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types. Version 2.6.3 should be blocked.
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0']);
        expect(getLatest(typesResult)).toBe('2.2.0');
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

        // Should block 1.5.0 version of @babel/test and unblock 3.0.0
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).not.toContain('1.5.0');
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Version 2.6.3 should be unblocked
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
        expect(getLatest(typesResult)).toBe('2.6.3');
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
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual([]);
        expect(typesResult.readme).toContain('blocked by rule');
      });

      test('allow by package', async function () {
        const config = {
          block: [{ scope: '@babel' }, { scope: '@types' }],
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual([]);
        expect(typesResult.readme).toContain('blocked by rule');
      });

      test('allow by version', async function () {
        const config = {
          block: [{ scope: '@babel' }, { scope: '@types' }],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock version 3.0.0 of @babel
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual([]);
        expect(typesResult.readme).toContain('blocked by rule');
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
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types/node
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual([]);
        expect(typesResult.readme).toContain('blocked by rule');
      });

      test('allow by package', async function () {
        const config = {
          block: [{ package: '@babel/test' }, { package: '@types/node' }],
          allow: [{ package: '@babel/test' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock all versions of @babel/test
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types/node
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual([]);
        expect(typesResult.readme).toContain('blocked by rule');
      });

      test('allow by version', async function () {
        const config = {
          block: [{ package: '@babel/test' }, { package: '@types/node' }],
          allow: [{ package: '@babel/test', versions: '3.0.0' }],
        };
        const plugin = new PackageFilterPlugin(config, pluginOptions);

        // Should unblock version 3.0.0 of @babel/test
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types/node
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual([]);
        expect(typesResult.readme).toContain('blocked by rule');
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
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types/node
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.2.0');
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0']);
        expect(getLatest(typesResult)).toBe('1.0.0');
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
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types/node
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.2.0');
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0']);
        expect(getLatest(typesResult)).toBe('1.0.0');
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
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).not.toContain('1.5.0');
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '3.0.0']);
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should not unblock @types/node
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).not.toContain('2.2.0');
        expect(getVersionKeys(typesResult)).not.toContain('2.6.3');
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0']);
        expect(getLatest(typesResult)).toBe('1.0.0');
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
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(babelResult.versions['1.0.0']._id).toBe('@babel/test@1.0.0');
        expect(babelResult.versions['1.5.0']._id).toBe('@babel/test@1.5.0');
        expect(babelResult.versions['3.0.0']._id).toBe('@babel/test@3.0.0');
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should replace version of @types/node to 1.0.0
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
        expect(typesResult.versions['2.2.0']._id).toBe('@types/node@1.0.0');
        expect(typesResult.versions['2.6.3']._id).toBe('@types/node@1.0.0');
        expect(typesResult.readme).toContain('replaced');
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
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(babelResult.versions['1.0.0']._id).toBe('@babel/test@1.0.0');
        expect(babelResult.versions['1.5.0']._id).toBe('@babel/test@1.5.0');
        expect(babelResult.versions['3.0.0']._id).toBe('@babel/test@3.0.0');
        expect(getLatest(babelResult)).toBe('3.0.0');

        // Should replace version of @types/node to 1.0.0
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
        expect(typesResult.versions['2.2.0']._id).toBe('@types/node@1.0.0');
        expect(typesResult.versions['2.6.3']._id).toBe('@types/node@1.0.0');
        expect(typesResult.readme).toContain('replaced');
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

        // Should only replace version 1.5.0 of @babel/test
        const babelResult = await plugin.filter_metadata(babelTestManifest);
        expect(getVersionKeys(babelResult)).toEqual(['1.0.0', '1.5.0', '3.0.0']);
        expect(babelResult.versions['1.5.0']._id).toBe('@babel/test@1.0.0');
        expect(babelResult.versions['3.0.0']._id).toBe('@babel/test@3.0.0');
        expect(babelResult.readme).toContain('replaced');

        // Should replace version of @types/node to 1.0.0
        const typesResult = await plugin.filter_metadata(typesNodeManifest);
        expect(getVersionKeys(typesResult)).toEqual(['1.0.0', '2.2.0', '2.6.3']);
        expect(typesResult.versions['2.2.0']._id).toBe('@types/node@1.0.0');
        expect(typesResult.versions['2.6.3']._id).toBe('@types/node@1.0.0');
        expect(typesResult.readme).toContain('replaced');
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
      const result = await plugin.filter_metadata(testaccioManifest);
      expect(getVersionKeys(result)).toEqual(['1.4.2', '1.4.4-beta', '1.7.1-beta', '2.2.1-next']);
      expect(getLatest(result)).toBe('1.4.2');
    });

    test('_distfiles are cleaned', async function () {
      const config = {
        block: [{ package: '@testaccio/test', versions: '1.7.0' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // Should block '1.7.0' version of @testaccio/test
      // Should clean _distfiles['testaccio-test-1.7.0.tgz']
      const result = await plugin.filter_metadata(testaccioManifest);
      expect(result._distfiles).not.toHaveProperty('testaccio-test-1.7.0.tgz');
      expect(result._distfiles).toHaveProperty('testaccio-test-1.4.2.tgz');
      expect(result._distfiles).toHaveProperty('testaccio-test-1.4.4-beta.tgz');
      expect(result._distfiles).toHaveProperty('testaccio-test-1.7.1-beta.tgz');
      expect(result._distfiles).toHaveProperty('testaccio-test-2.2.1-next.tgz');
    });
  });

  describe('manifest validity', () => {
    test('empty package does not break the plugin', async function () {
      const config = {
        block: [{ package: 'some-package', versions: '7.7.7' }],
      };
      const plugin = new PackageFilterPlugin(config, pluginOptions);

      // It's unlikely that Verdaccio will call this method with an empty package, but just in case
      const result = await plugin.filter_metadata(emptyManifest);
      expect(result).toBeDefined();
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
      const result = await plugin.filter_metadata(packageWithNoDistFiles as unknown as Manifest);
      expect(getVersionKeys(result as Manifest)).toEqual([
        '1.4.2',
        '1.4.4-beta',
        '1.7.1-beta',
        '2.2.1-next',
      ]);
      expect(getLatest(result as Manifest)).toBe('1.4.2');
    });
  });
});
