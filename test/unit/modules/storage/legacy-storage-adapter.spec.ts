import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Readable } from 'node:stream';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { getDefaultConfig } from '@verdaccio/config';
import LocalDatabaseNewModule from '@verdaccio/local-storage';
import LocalDatabaseLegacyModule from '@verdaccio/local-storage-legacy';
import { setup } from '@verdaccio/logger';
import type { Logger } from '@verdaccio/types';

import AppConfig from '../../../../src/lib/config';
import {
  isLegacyStoragePlugin,
  wrapLegacyStoragePlugin,
} from '../../../../src/lib/legacy-storage-adapter';

// CJS/ESM interop for the plugin default exports
const LocalDatabaseLegacy = (LocalDatabaseLegacyModule as any).default || LocalDatabaseLegacyModule;
const LocalDatabaseNew = (LocalDatabaseNewModule as any).default || LocalDatabaseNewModule;

let logger: Logger;

function buildConfig(storageDir: string): any {
  const raw: any = getDefaultConfig();
  raw.storage = storageDir;
  raw.self_path = path.join(storageDir, 'config.yaml');
  return new AppConfig(raw);
}

function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (c) => chunks.push(Buffer.from(c)));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString()));
    stream.on('error', reject);
  });
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

  describe('OLD: real @verdaccio/local-storage-legacy through the adapter', () => {
    let storageDir: string;
    let plugin: any;
    const pkgName = 'legacy-pkg';
    const manifest: any = {
      name: pkgName,
      'dist-tags': { latest: '1.0.0' },
      versions: { '1.0.0': { name: pkgName, version: '1.0.0' } },
      time: {},
      _attachments: {},
      _distfiles: {},
      _uplinks: {},
      _rev: '',
    };

    beforeAll(async () => {
      storageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'legacy-store-'));
      const raw = new LocalDatabaseLegacy(buildConfig(storageDir), logger);
      plugin = wrapLegacyStoragePlugin(raw, logger);
      if (typeof plugin.init === 'function') {
        await plugin.init();
      }
    });

    afterAll(() => {
      fs.rmSync(storageDir, { recursive: true, force: true });
    });

    test('the real legacy plugin is detected as legacy', () => {
      expect(isLegacyStoragePlugin(new LocalDatabaseLegacy(buildConfig(storageDir), logger))).toBe(
        true
      );
    });

    test('plugin-level get() resolves to a list', async () => {
      const list = await plugin.get();
      expect(Array.isArray(list)).toBe(true);
    });

    test('createPackage + readPackage round-trips through callbacks', async () => {
      const handler = plugin.getPackageStorage(pkgName);
      await handler.createPackage(pkgName, manifest);
      const read = await handler.readPackage(pkgName);
      expect(read.name).toBe(pkgName);
      expect(read['dist-tags'].latest).toBe('1.0.0');
    });

    test('hasPackage reflects existence', async () => {
      const handler = plugin.getPackageStorage(pkgName);
      expect(await handler.hasPackage(pkgName)).toBe(true);
      const missing = plugin.getPackageStorage('does-not-exist');
      expect(await missing.hasPackage('does-not-exist')).toBe(false);
    });

    test('updatePackage maps the 5-arg callback form and returns the updated manifest', async () => {
      const handler = plugin.getPackageStorage(pkgName);
      const updated = await handler.updatePackage(pkgName, async (data: any) => {
        return { ...data, 'dist-tags': { latest: '1.1.0' } };
      });
      expect(updated['dist-tags'].latest).toBe('1.1.0');
      // store persists separately via savePackage; emulate that and re-read
      await handler.savePackage(pkgName, updated);
      const read = await handler.readPackage(pkgName);
      expect(read['dist-tags'].latest).toBe('1.1.0');
    });

    test('writeTarball bridges the legacy UploadTarball (open/done/close) and persists bytes', async () => {
      const handler = plugin.getPackageStorage(pkgName);
      const tarball = `${pkgName}-1.0.0.tgz`;
      const payload = 'hello-legacy-tarball';
      const ac = new AbortController();
      const ws = await handler.writeTarball(tarball, { signal: ac.signal });
      await new Promise<void>((resolve, reject) => {
        ws.on('error', reject);
        ws.on('open', () => ws.end(Buffer.from(payload)));
        ws.on('close', () => resolve());
      });
      expect(await handler.hasTarball(tarball)).toBe(true);
      const rs = await handler.readTarball(tarball, { signal: new AbortController().signal });
      expect(await streamToString(rs)).toBe(payload);
    });

    test('deletePackage removes a file', async () => {
      const handler = plugin.getPackageStorage(pkgName);
      const tarball = `${pkgName}-1.0.0.tgz`;
      await handler.deletePackage(tarball);
      expect(await handler.hasTarball(tarball)).toBe(false);
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
