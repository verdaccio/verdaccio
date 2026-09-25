import { describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { DIST_TAGS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import type { Manifest } from '@verdaccio/types';

import { Storage } from '../src';

describe('search performance', () => {
  test('applies filters for local search items concurrently', async () => {
    const logger = await setup({});
    const config = new Config(getDefaultConfig());
    const storage = new Storage(config, logger);
    const packages = ['foo-1', 'foo-2', 'foo-3'];

    // @ts-expect-error test-only partial localStorage replacement
    storage.localStorage = {
      getStoragePlugin: () => ({
        search: async () =>
          packages.map((name) => ({
            package: { name },
            score: {
              final: 1,
              detail: {
                maintenance: 0,
                popularity: 1,
                quality: 1,
              },
            },
            verdaccioPrivate: true,
            verdaccioPkgCached: false,
          })),
      }),
    };

    const manifest = {
      name: 'foo',
      [DIST_TAGS]: { latest: '1.0.0' },
      versions: {
        '1.0.0': {
          name: 'foo',
          version: '1.0.0',
          description: 'foo',
        },
      },
      time: {
        '1.0.0': new Date().toISOString(),
      },
      _attachments: {},
      _uplinks: {},
      _distfiles: {},
      _rev: '1',
    } as unknown as Manifest;

    vi.spyOn(storage, 'getPackageLocalMetadata').mockResolvedValue(manifest);

    let inFlight = 0;
    let maxInFlight = 0;
    vi.spyOn(storage, 'applyFilters').mockImplementation(async (localManifest) => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 25));
      inFlight -= 1;
      return [localManifest, []];
    });

    // @ts-expect-error only text is required by getCachedPackages
    const results = await storage.getCachedPackages({ text: 'foo' });
    expect(results).toHaveLength(packages.length);
    expect(maxInFlight).toBeGreaterThan(1);
  });
});
