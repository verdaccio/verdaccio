import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, test } from 'vitest';

import { getDefaultConfig } from '@verdaccio/config';
import LocalDatabaseNewModule from '@verdaccio/local-storage';
import { setup } from '@verdaccio/logger';
import type { Logger } from '@verdaccio/types';

import AppConfig from '../../../../src/lib/config';
import {
  isLegacyStoragePlugin,
  wrapLegacyStoragePlugin,
} from '../../../../src/lib/legacy-storage-adapter';

// CJS/ESM interop for the plugin default export
const LocalDatabaseNew = (LocalDatabaseNewModule as any).default || LocalDatabaseNewModule;

let logger: Logger;

function buildConfig(storageDir: string): any {
  const raw: any = getDefaultConfig();
  raw.storage = storageDir;
  raw.self_path = path.join(storageDir, 'config.yaml');
  return new AppConfig(raw);
}

beforeAll(async () => {
  logger = await setup({ type: 'stdout', format: 'pretty', level: 'fatal' } as any);
});

/** A legacy plugin that emits the documented shape: the package itself. */
function legacyPluginEmitting(names: string[], opts: { honourPredicate?: boolean } = {}): any {
  return {
    get: (cb: any) => cb(null, names),
    add: (_name: string, cb: any) => cb(null),
    getSecret: () => Promise.resolve('secret'),
    setSecret: () => Promise.resolve(),
    getPackageStorage: () => undefined,
    search(onPackage: any, onEnd: any, validate: (name: string) => boolean) {
      const emit = opts.honourPredicate ? names.filter((n) => validate(n)) : names;
      let i = 0;
      const next = (): void => {
        if (i >= emit.length) {
          onEnd();
          return;
        }
        onPackage({ name: emit[i++], path: 'p', time: 0 }, next);
      };
      next();
    },
  };
}

describe('legacy storage adapter', () => {
  describe('isLegacyStoragePlugin (detection)', () => {
    test('detects a callback-style plugin as legacy', () => {
      const legacy = { get: (_cb: any) => {}, add: (_n: string, _cb: any) => {} };
      expect(isLegacyStoragePlugin(legacy)).toBe(true);
    });

    test('does not flag a promise-style plugin', () => {
      const promised = { get: () => Promise.resolve([]), add: (_n: string) => Promise.resolve() };
      expect(isLegacyStoragePlugin(promised)).toBe(false);
    });

    test('is safe for empty / nullish input', () => {
      expect(isLegacyStoragePlugin(null)).toBe(false);
      expect(isLegacyStoragePlugin(undefined)).toBe(false);
      expect(isLegacyStoragePlugin({})).toBe(false);
    });
  });

  describe('NEW: real @verdaccio/local-storage is used untouched', () => {
    test('a promise-based plugin is not detected as legacy (no wrapping)', () => {
      const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'new-store-'));
      try {
        const plugin = new LocalDatabaseNew(buildConfig(storageDir), logger);
        expect(isLegacyStoragePlugin(plugin)).toBe(false);
      } finally {
        fs.rmSync(storageDir, { recursive: true, force: true });
      }
    });

    test('its handler already exposes promise methods', async () => {
      const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'new-store-'));
      try {
        const plugin = new LocalDatabaseNew(buildConfig(storageDir), logger);
        await plugin.init();
        const handler = plugin.getPackageStorage('new-pkg');
        const result = handler.readPackage('new-pkg');
        // promise contract: methods return thenables
        expect(typeof result.then).toBe('function');
        await result.catch(() => undefined);
      } finally {
        fs.rmSync(storageDir, { recursive: true, force: true });
      }
    });
  });

  describe('search', () => {
    // Regression: the adapter dropped the query and passed `() => true`, so every
    // package came back for any text. /-/v1/search returned the whole catalogue.
    test('filters the collected results by the query text', async () => {
      const plugin = legacyPluginEmitting(['alpha-one', 'alpha-two', 'beta-one']);
      const wrapped = wrapLegacyStoragePlugin(plugin, logger);

      const items = await wrapped.search({ text: 'alpha' });

      expect(items.map((i: any) => i.package.name)).toEqual(['alpha-one', 'alpha-two']);
    });

    // Regression: the legacy contract emits the package itself, but the store reads
    // `item.package.name`. Passing it through unwrapped made the endpoint fail.
    test('wraps the legacy item shape into a search item', async () => {
      const plugin = legacyPluginEmitting(['solo-pkg']);
      const wrapped = wrapLegacyStoragePlugin(plugin, logger);

      const [item] = await wrapped.search({ text: 'solo' });

      expect(item.package.name).toBe('solo-pkg');
      expect(item.score.final).toBeDefined();
    });

    test('lets a plugin skip names early through the predicate', async () => {
      const plugin = legacyPluginEmitting(['alpha-one', 'beta-one'], { honourPredicate: true });
      const wrapped = wrapLegacyStoragePlugin(plugin, logger);

      const items = await wrapped.search({ text: 'beta' });

      expect(items.map((i: any) => i.package.name)).toEqual(['beta-one']);
    });

    test('returns everything when there is no query text', async () => {
      const plugin = legacyPluginEmitting(['alpha-one', 'beta-one']);
      const wrapped = wrapLegacyStoragePlugin(plugin, logger);

      expect(await wrapped.search({})).toHaveLength(2);
    });
  });
});
