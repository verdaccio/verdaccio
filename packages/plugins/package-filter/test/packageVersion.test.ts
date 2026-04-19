import path from 'node:path';
import { beforeAll, describe, expect, test } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { DIST_TAGS } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';
import type { Manifest } from '@verdaccio/types';

import { filterBlockedVersions } from '../src/filtering/packageVersion';
import PackageFilterPlugin from '../src/index';

let pluginOptions: { logger: any; config: Config };

beforeAll(async () => {
  await setup({});
  const verdaccioConfig = new Config(
    parseConfigFile(path.join(import.meta.dirname, '__fixtures__', 'config.yaml'))
  );
  pluginOptions = { logger, config: verdaccioConfig };
});

function createManifest(versions: string[]): Manifest {
  const manifest = {
    name: 'test-pkg',
    [DIST_TAGS]: { latest: versions[versions.length - 1] },
    versions: {},
    time: {},
    _distfiles: {},
    _attachments: {},
    _uplinks: {},
    _rev: '1-abc',
    readme: 'test readme',
  } as unknown as Manifest;

  for (const v of versions) {
    manifest.versions[v] = { name: 'test-pkg', version: v } as any;
    manifest.time![v] = '2020-01-01T00:00:00.000Z';
  }

  return manifest;
}

describe('filterBlockedVersions', () => {
  test('returns manifest unchanged when matched rule has empty versions array', async () => {
    await setup({});
    const manifest = createManifest(['1.0.0', '2.0.0']);
    // A rule with empty versions array — defensive guard
    const blockRules = new Map<string, any>([['test-pkg', { versions: [], strategy: 'block' }]]);
    const allowRules = new Map();

    const result = filterBlockedVersions(manifest, blockRules, allowRules, logger);

    expect(Object.keys(result.versions)).toEqual(['1.0.0', '2.0.0']);
  });
});

describe('replace strategy edge cases', () => {
  test('removes versions when no earlier version exists to replace with', async () => {
    const config = {
      block: [{ package: 'test-pkg', versions: '*', strategy: 'replace' as const }],
    };
    const plugin = new PackageFilterPlugin(config, pluginOptions);
    const manifest = createManifest(['1.0.0', '2.0.0', '3.0.0']);

    const result = await plugin.filter_metadata(manifest);

    // All versions blocked with no predecessor — all removed
    expect(Object.keys(result.versions)).toHaveLength(0);
    expect(result.readme).toContain('could not be replaced and thus are fully blocked');
  });

  test('removes early versions and replaces later ones', async () => {
    const config = {
      block: [{ package: 'test-pkg', versions: '>=1.0.0 <3.0.0', strategy: 'replace' as const }],
    };
    const plugin = new PackageFilterPlugin(config, pluginOptions);
    const manifest = createManifest(['1.0.0', '2.0.0', '3.0.0']);

    const result = await plugin.filter_metadata(manifest);

    // 1.0.0 has no predecessor -> removed
    // 2.0.0 has no predecessor -> removed
    // 3.0.0 is outside range -> kept
    expect(Object.keys(result.versions)).toEqual(['3.0.0']);
    expect(result.readme).toContain('could not be replaced and thus are fully blocked');
  });
});
