import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, test } from 'vitest';

import { getDefaultConfig } from '@verdaccio/config';
import LocalDatabaseNewModule from '@verdaccio/local-storage';
import { setup } from '@verdaccio/logger';
import type { Logger } from '@verdaccio/types';

import AppConfig from '../../../../src/lib/config';
import { isLegacyStoragePlugin } from '../../../../src/lib/legacy-storage-adapter';

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
});
