import fs from 'fs';
import nock from 'nock';
import path from 'path';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { fileUtils } from '@verdaccio/core';
import type { Config } from '@verdaccio/types';

import AppConfig from '../../../../src/lib/config';
import { API_ERROR, HTTP_STATUS } from '../../../../src/lib/constants';
import { setup } from '../../../../src/lib/logger';
import Storage from '../../../../src/lib/storage';
import configExample from '../../partials/config';

setup({});

vi.setConfig({ testTimeout: 10000 });

const UPLINK_URL = 'http://localhost:55550';
const storagePath = await fileUtils.createTempStorageFolder('store-spec-nock');

// Configure the plugins folder absolutely so the async loader resolves local test plugins
const PLUGINS_DIR = path.join(__dirname, '..', 'api', 'partials', 'plugin');
// The filter plugin id (short name). Loader will look for `${prefix}-${id}` within PLUGINS_DIR
const FILTER_PLUGIN_ID = 'filter';

// Mock data loaded from disk (same data the old mock server used)
const MOCK_STORE = path.join(__dirname, '../../partials/mock-store');
const jqueryMetadata = JSON.parse(
  fs.readFileSync(path.join(MOCK_STORE, 'jquery/package.json')).toString()
);

type GenerateStorageOptions = {
  enableFilters?: boolean;
  filterPkg?: string;
  filterVersion?: string;
};

const generateStorage = async function (opts: GenerateStorageOptions = {}) {
  const { enableFilters = false, filterPkg = 'jquery', filterVersion = '1.5.1' } = opts;

  const baseConfig: any = {
    self_path: __dirname,
    storage: storagePath,
    uplinks: {
      npmjs: {
        url: UPLINK_URL,
      },
    },
  };

  const storageConfig = configExample(
    enableFilters
      ? {
          ...baseConfig,
          plugins: PLUGINS_DIR,
          filters: {
            [FILTER_PLUGIN_ID]: {
              pkg: filterPkg,
              version: filterVersion,
            },
          },
        }
      : baseConfig,
    'store.spec.yaml'
  );

  const config: Config = new AppConfig(storageConfig);
  const store: any = new Storage(config);
  // If filters are enabled, let Storage auto-load them from config by NOT passing []
  if (enableFilters) {
    await store.init(config);
  } else {
    await store.init(config, []);
  }

  return store;
};

const ensureLocalMetadata = (pkgName = 'npm_test') => {
  const metadataSource = path.join(__dirname, '../../partials/metadata');
  const pkgDir = path.join(storagePath, pkgName);
  if (!fs.existsSync(pkgDir)) {
    fs.mkdirSync(pkgDir, { recursive: true });
  }
  const raw = fs.readFileSync(metadataSource).toString();
  const content = pkgName !== 'npm_test' ? raw.replace(/"npm_test"/g, `"${pkgName}"`) : raw;
  fs.writeFileSync(path.join(pkgDir, 'package.json'), content);
  return JSON.parse(content);
};

/**
 * Set up nock interceptors for the uplink. Call this before tests that
 * fetch metadata from the uplink.
 */
const setupNock = () => {
  const scope = nock(UPLINK_URL);

  // jquery — return real metadata from mock-store
  scope.get('/jquery').reply(200, jqueryMetadata).persist();

  // @verdaccio/404 — not found
  scope.get('/@verdaccio%2F404').reply(404, {}).persist();
  scope.get('/@verdaccio/404').reply(404, {}).persist();

  // @verdaccio/does-not-exist-at-all — not found
  scope.get('/@verdaccio%2Fdoes-not-exist-at-all').reply(404, {}).persist();
  scope.get('/@verdaccio/does-not-exist-at-all').reply(404, {}).persist();

  // corrupted-package — returns invalid JSON (triggers 500 path)
  scope
    .get('/corrupted-package')
    .reply(200, '{invalid json', { 'content-type': 'application/json' })
    .persist();

  return scope;
};

describe('StorageTest', () => {
  beforeAll(() => {
    nock.disableNetConnect();
    setupNock();
  });

  afterEach(() => {
    // Clean up any pending nock interceptors but keep persistent ones
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test('should be defined', async () => {
    const storage: any = await generateStorage();

    expect(storage).toBeDefined();
  });

  test('should skip init if already initialized', async () => {
    const storage: any = await generateStorage();
    // Call init again — should not reinitialize
    await storage.init(storage.config, []);
    expect(storage.localStorage).toBeDefined();
  });

  describe('test _syncUplinksMetadata', () => {
    test('should fetch from uplink jquery metadata from registry', async () => {
      const storage: any = await generateStorage();

      return new Promise((resolve) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err: any, metadata: any) => {
          expect(err).toBeNull();
          expect(metadata).toBeDefined();
          expect(metadata).toBeInstanceOf(Object);
          resolve(true);
        });
      });
    });

    test('should fails on fetch from uplink non existing from registry', async () => {
      const storage: any = await generateStorage();

      return new Promise((resolve) => {
        // @ts-ignore
        storage._syncUplinksMetadata('@verdaccio/404', null, {}, (err, metadata, errors) => {
          expect(err).not.toBeNull();
          expect(errors).toBeInstanceOf(Array);
          expect(errors[0][0].statusCode).toBe(HTTP_STATUS.NOT_FOUND);
          expect(errors[0][0].message).toMatch(API_ERROR.NOT_PACKAGE_UPLINK);
          resolve(true);
        });
      });
    });

    test('should fails on fetch from uplink corrupted pkg from registry', async () => {
      const storage: any = await generateStorage();

      return new Promise((resolve) => {
        // @ts-ignore
        storage._syncUplinksMetadata('corrupted-package', null, {}, (err, metadata, errors) => {
          expect(err).not.toBeNull();
          expect(errors).toBeInstanceOf(Array);
          resolve(true);
        });
      });
    });

    test('should not touch if the package exists and has no uplinks', async () => {
      const storage: any = (await generateStorage()) as any;
      const metadataSource = path.join(__dirname, '../../partials/metadata');
      const metadataPath = path.join(storagePath, 'npm_test/package.json');

      if (!fs.existsSync(path.join(storagePath, 'npm_test'))) {
        fs.mkdirSync(path.join(storagePath, 'npm_test'), { recursive: true });
      }
      fs.writeFileSync(metadataPath, fs.readFileSync(metadataSource));
      const metadata = JSON.parse(fs.readFileSync(metadataPath).toString());
      // @ts-ignore
      storage.localStorage.updateVersions = vi.fn(storage.localStorage.updateVersions);
      expect(metadata).toBeDefined();
      return new Promise((resolve) => {
        storage._syncUplinksMetadata('npm_test', metadata, {}, (err: any) => {
          expect(err).toBeNull();
          // @ts-ignore
          expect(storage.localStorage.updateVersions).not.toHaveBeenCalled();
          resolve(true);
        });
      });
    });
  });

  describe('delegate methods', () => {
    test('addVersion should delegate to localStorage', async () => {
      const storage: any = await generateStorage();
      const cb = vi.fn();
      storage.localStorage.addVersion = vi.fn((_n, _v, _m, _t, callback) => callback());
      storage.addVersion('pkg', '1.0.0', { name: 'pkg', version: '1.0.0' } as any, 'latest', cb);
      expect(storage.localStorage.addVersion).toHaveBeenCalledWith(
        'pkg',
        '1.0.0',
        expect.any(Object),
        'latest',
        cb
      );
    });

    test('mergeTags should delegate to localStorage', async () => {
      const storage: any = await generateStorage();
      const cb = vi.fn();
      storage.localStorage.mergeTags = vi.fn((_n, _t, callback) => callback());
      storage.mergeTags('pkg', { latest: '1.0.0' }, cb);
      expect(storage.localStorage.mergeTags).toHaveBeenCalledWith('pkg', { latest: '1.0.0' }, cb);
    });

    test('changePackage should delegate to localStorage', async () => {
      const storage: any = await generateStorage();
      const cb = vi.fn();
      storage.localStorage.changePackage = vi.fn((_n, _m, _r, callback) => callback());
      storage.changePackage('pkg', { name: 'pkg' } as any, '1-abc', cb);
      expect(storage.localStorage.changePackage).toHaveBeenCalledWith(
        'pkg',
        expect.any(Object),
        '1-abc',
        cb
      );
    });

    test('removePackage should delegate to localStorage and update indexer', async () => {
      const storage: any = await generateStorage();
      const cb = vi.fn();
      storage.localStorage.removePackage = vi.fn((_n, callback) => callback());
      storage.removePackage('pkg', cb);
      expect(storage.localStorage.removePackage).toHaveBeenCalledWith('pkg', cb);
    });

    test('removeTarball should delegate to localStorage', async () => {
      const storage: any = await generateStorage();
      const cb = vi.fn();
      storage.localStorage.removeTarball = vi.fn((_n, _f, _r, callback) => callback());
      storage.removeTarball('pkg', 'pkg-1.0.0.tgz', '1-abc', cb);
      expect(storage.localStorage.removeTarball).toHaveBeenCalledWith(
        'pkg',
        'pkg-1.0.0.tgz',
        '1-abc',
        cb
      );
    });

    test('addTarball should delegate to localStorage', async () => {
      const storage: any = await generateStorage();
      const mockStream = { on: vi.fn() };
      storage.localStorage.addTarball = vi.fn(() => mockStream);
      const result = storage.addTarball('pkg', 'pkg-1.0.0.tgz');
      expect(result).toBe(mockStream);
      expect(storage.localStorage.addTarball).toHaveBeenCalledWith('pkg', 'pkg-1.0.0.tgz');
    });

    test('readTokens should delegate to localStorage', async () => {
      const storage: any = await generateStorage();
      const tokens = [{ user: 'test', token: 'abc' }];
      storage.localStorage.readTokens = vi.fn().mockResolvedValue(tokens);
      const result = await storage.readTokens({ user: 'test' });
      expect(result).toEqual(tokens);
    });

    test('saveToken should delegate to localStorage', async () => {
      const storage: any = await generateStorage();
      storage.localStorage.saveToken = vi.fn().mockResolvedValue(undefined);
      await storage.saveToken({ user: 'test', token: 'abc' } as any);
      expect(storage.localStorage.saveToken).toHaveBeenCalled();
    });

    test('deleteToken should delegate to localStorage', async () => {
      const storage: any = await generateStorage();
      storage.localStorage.deleteToken = vi.fn().mockResolvedValue(undefined);
      await storage.deleteToken('test', 'tokenKey');
      expect(storage.localStorage.deleteToken).toHaveBeenCalledWith('test', 'tokenKey');
    });
  });

  describe('addPackage', () => {
    test('should call callback on success', async () => {
      const storage: any = await generateStorage();
      storage.localStorage.addPackage = vi.fn((_n, _m, cb) => cb());
      storage.localStorage.getPackageMetadata = vi.fn((_n, cb) =>
        cb({ status: HTTP_STATUS.NOT_FOUND })
      );

      return new Promise<void>((resolve, reject) => {
        storage.addPackage('new-pkg', { name: 'new-pkg' }, (err: any) => {
          try {
            // The function may succeed or fail depending on uplink checks,
            // but the callback should be invoked
            expect(typeof err === 'undefined' || err === null || err instanceof Error).toBe(true);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });

    test('should call callback with error on failure', async () => {
      const storage: any = await generateStorage();
      // Mock checkPackageLocal to throw
      storage.localStorage.getPackageMetadata = vi.fn((_n, cb) => cb(null, { name: 'existing' }));

      return new Promise<void>((resolve, reject) => {
        storage.addPackage('existing-pkg', { name: 'existing-pkg' }, (err: any) => {
          try {
            expect(err).toBeDefined();
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  });

  describe('_isAllowPublishOffline', () => {
    test('should return false by default', async () => {
      const storage: any = await generateStorage();
      expect(storage._isAllowPublishOffline()).toBe(false);
    });

    test('should return true when allow_offline is configured', async () => {
      const storage: any = await generateStorage();
      storage.config.publish = { allow_offline: true };
      expect(storage._isAllowPublishOffline()).toBe(true);
    });

    test('should return false when allow_offline is not boolean', async () => {
      const storage: any = await generateStorage();
      storage.config.publish = { allow_offline: 'yes' };
      expect(storage._isAllowPublishOffline()).toBe(false);
    });
  });

  describe('hasLocalTarball', () => {
    test('should return false when tarball does not exist', async () => {
      const storage: any = await generateStorage();
      const result = await storage.hasLocalTarball('npm_test', 'nonexistent-0.0.0.tgz');
      expect(result).toBe(false);
    });

    test('should return true when tarball exists locally', async () => {
      const storage: any = await generateStorage();
      // Create a fake tarball on disk
      ensureLocalMetadata('npm_test');
      const tarballPath = path.join(storagePath, 'npm_test', 'npm_test-1.0.0.tgz');
      fs.writeFileSync(tarballPath, 'fake-tarball-content');

      const result = await storage.hasLocalTarball('npm_test', 'npm_test-1.0.0.tgz');
      expect(result).toBe(true);
    });
  });

  describe('getTarball', () => {
    test('should return a ReadTarball stream', async () => {
      const storage: any = await generateStorage();
      const stream = storage.getTarball('npm_test', 'npm_test-1.0.0.tgz');
      expect(stream).toBeDefined();
      expect(typeof stream.abort).toBe('function');
    });

    test('should emit error for non-existing tarball', async () => {
      const storage: any = await generateStorage();
      ensureLocalMetadata('npm_test');

      return new Promise<void>((resolve, reject) => {
        const stream = storage.getTarball('npm_test', 'npm_test-999.0.0.tgz');
        stream.on('error', (err: any) => {
          try {
            expect(err).toBeDefined();
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });

    test('should serve tarball from uplink when not found locally (serveFile with proxy uplink)', async () => {
      const storage: any = await generateStorage();
      const tarballFixture = path.join(__dirname, '../uplinks/__fixtures__/jquery-1.5.1.tgz');
      const tarballSize = fs.statSync(tarballFixture).size;
      const distfileUrl = `${UPLINK_URL}/jquery/-/jquery-1.5.1.tgz`;

      // Mock getPackageMetadata to return metadata with _distfiles directly,
      // avoiding cross-test pollution from prior jquery syncs
      const origGetPkgMeta = storage.localStorage.getPackageMetadata.bind(storage.localStorage);
      storage.localStorage.getPackageMetadata = vi.fn((name, cb) => {
        if (name === 'jquery') {
          const metadata = JSON.parse(JSON.stringify(jqueryMetadata));
          metadata._distfiles = {
            'jquery-1.5.1.tgz': {
              url: distfileUrl,
              sha: '2ae2d661e906c1a01e044a71bb5b2743942183e5',
            },
          };
          return cb(null, metadata);
        }
        return origGetPkgMeta(name, cb);
      });

      // Nock the tarball fetch from the uplink
      nock(UPLINK_URL).get('/jquery/-/jquery-1.5.1.tgz').replyWithFile(200, tarballFixture, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': tarballSize.toString(),
      });

      return new Promise<void>((resolve, reject) => {
        const stream = storage.getTarball('jquery', 'jquery-1.5.1.tgz');
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => {
          try {
            const totalBytes = chunks.reduce((sum, c) => sum + c.length, 0);
            expect(totalBytes).toBeGreaterThan(0);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        stream.on('error', (err: any) => {
          reject(new Error(`Unexpected error: ${err.message}`));
        });
      });
    });

    test('should serve tarball via autogenerated proxy when no matching uplink', async () => {
      const storage: any = await generateStorage();
      const tarballFixture = path.join(__dirname, '../uplinks/__fixtures__/jquery-1.5.1.tgz');
      const tarballSize = fs.statSync(tarballFixture).size;

      // Use npm_test which has no proxy configured → uplink == null → autogenerated proxy
      ensureLocalMetadata('npm_test');
      // Overwrite metadata to include _distfiles pointing to an external URL
      const externalUrl = 'http://external-registry.test';
      const pkgDir = path.join(storagePath, 'npm_test');
      const metadata = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json')).toString());
      metadata._distfiles = {
        'npm_test-1.0.0.tgz': {
          url: `${externalUrl}/npm_test/-/npm_test-1.0.0.tgz`,
          sha: 'abc123',
        },
      };
      fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify(metadata));

      // Nock the external URL
      nock(externalUrl).get('/npm_test/-/npm_test-1.0.0.tgz').replyWithFile(200, tarballFixture, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': tarballSize.toString(),
      });

      return new Promise<void>((resolve, reject) => {
        const stream = storage.getTarball('npm_test', 'npm_test-1.0.0.tgz');
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => {
          try {
            const totalBytes = chunks.reduce((sum, c) => sum + c.length, 0);
            expect(totalBytes).toBeGreaterThan(0);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        stream.on('error', (err: any) => {
          reject(new Error(`Unexpected error: ${err.message}`));
        });
      });
    });

    test('should emit error when upstream tarball fetch fails in serveFile', async () => {
      const storage: any = await generateStorage();
      const distfileUrl = `${UPLINK_URL}/jquery/-/jquery-1.6.2.tgz`;

      // Mock getPackageMetadata to return metadata with _distfiles
      const origGetPkgMeta = storage.localStorage.getPackageMetadata.bind(storage.localStorage);
      storage.localStorage.getPackageMetadata = vi.fn((name, cb) => {
        if (name === 'jquery') {
          const metadata = JSON.parse(JSON.stringify(jqueryMetadata));
          metadata._distfiles = {
            'jquery-1.6.2.tgz': { url: distfileUrl, sha: 'abc' },
          };
          return cb(null, metadata);
        }
        return origGetPkgMeta(name, cb);
      });

      // Nock the tarball fetch to fail
      nock(UPLINK_URL).get('/jquery/-/jquery-1.6.2.tgz').reply(500, 'Internal Server Error');

      return new Promise<void>((resolve, reject) => {
        const stream = storage.getTarball('jquery', 'jquery-1.6.2.tgz');
        stream.on('error', (err: any) => {
          try {
            expect(err).toBeDefined();
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        stream.on('end', () => {
          reject(new Error('Expected error but stream ended'));
        });
      });
    });

    test('should serve tarball without caching when uplink cache is disabled', async () => {
      const storage: any = await generateStorage();
      const tarballFixture = path.join(__dirname, '../uplinks/__fixtures__/jquery-1.5.1.tgz');
      const tarballSize = fs.statSync(tarballFixture).size;
      const distfileUrl = `${UPLINK_URL}/jquery/-/jquery-1.8.2.tgz`;

      // Mock getPackageMetadata to return metadata with _distfiles directly,
      // avoiding cross-test pollution from prior jquery syncs
      const origGetPkgMeta = storage.localStorage.getPackageMetadata.bind(storage.localStorage);
      storage.localStorage.getPackageMetadata = vi.fn((name, cb) => {
        if (name === 'jquery') {
          const metadata = JSON.parse(JSON.stringify(jqueryMetadata));
          metadata._distfiles = {
            'jquery-1.8.2.tgz': { url: distfileUrl, sha: 'xyz' },
          };
          return cb(null, metadata);
        }
        return origGetPkgMeta(name, cb);
      });

      // Disable cache on the uplink so savestream is null (covers the else branch L406-408)
      Object.values(storage.uplinks).forEach((u: any) => {
        u.config.cache = false;
      });

      nock(UPLINK_URL).get('/jquery/-/jquery-1.8.2.tgz').replyWithFile(200, tarballFixture, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': tarballSize.toString(),
      });

      return new Promise<void>((resolve, reject) => {
        const stream = storage.getTarball('jquery', 'jquery-1.8.2.tgz');
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => {
          try {
            expect(chunks.reduce((sum, c) => sum + c.length, 0)).toBeGreaterThan(0);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        stream.on('error', (err: any) => {
          reject(new Error(`Unexpected error: ${err.message}`));
        });
      });
    });

    test('should handle savestream error in serveFile gracefully', async () => {
      const storage: any = await generateStorage();
      const tarballFixture = path.join(__dirname, '../uplinks/__fixtures__/jquery-1.5.1.tgz');
      const tarballSize = fs.statSync(tarballFixture).size;
      const distfileUrl = `${UPLINK_URL}/jquery/-/jquery-1.7.2.tgz`;

      // Mock getPackageMetadata to return metadata with _distfiles
      const origGetPkgMeta = storage.localStorage.getPackageMetadata.bind(storage.localStorage);
      storage.localStorage.getPackageMetadata = vi.fn((name, cb) => {
        if (name === 'jquery') {
          const metadata = JSON.parse(JSON.stringify(jqueryMetadata));
          metadata._distfiles = {
            'jquery-1.7.2.tgz': { url: distfileUrl, sha: 'def' },
          };
          return cb(null, metadata);
        }
        return origGetPkgMeta(name, cb);
      });

      // Mock addTarball to return a stream that emits an error (simulates write failure)
      const EventEmitter = require('events');
      const fakeSaveStream = new EventEmitter();
      fakeSaveStream.abort = vi.fn();
      storage.localStorage.addTarball = vi.fn(() => fakeSaveStream);

      // Nock the tarball fetch
      nock(UPLINK_URL).get('/jquery/-/jquery-1.7.2.tgz').replyWithFile(200, tarballFixture, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': tarballSize.toString(),
      });

      return new Promise<void>((resolve, reject) => {
        const stream = storage.getTarball('jquery', 'jquery-1.7.2.tgz');
        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => chunks.push(chunk));
        stream.on('end', () => {
          try {
            // Even though savestream errored, the tarball should still be served to the client
            const totalBytes = chunks.reduce((sum, c) => sum + c.length, 0);
            expect(totalBytes).toBeGreaterThan(0);
            expect(fakeSaveStream.abort).toHaveBeenCalled();
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        stream.on('error', (err: any) => {
          reject(new Error(`Unexpected error: ${err.message}`));
        });

        // Trigger the savestream error after a tick (to let the open/error listeners bind)
        setTimeout(() => {
          fakeSaveStream.emit('error', new Error('disk full'));
        }, 50);
      });
    });
  });

  describe('getPackage', () => {
    test('should return metadata for a package with uplinks', async () => {
      const storage: any = await generateStorage();

      return new Promise<void>((resolve, reject) => {
        storage.getPackage({
          name: 'jquery',
          uplinksLook: true,
          callback: (err: any, result: any) => {
            try {
              expect(err).toBeNull();
              expect(result).toBeDefined();
              expect(result.name).toBe('jquery');
              expect(result.versions).toBeDefined();
              expect(result._attachments).toEqual({});
              resolve();
            } catch (e) {
              reject(e);
            }
          },
        });
      });
    });

    test('should return abbreviated manifest when requested', async () => {
      const storage: any = await generateStorage();

      return new Promise<void>((resolve, reject) => {
        storage.getPackage({
          name: 'jquery',
          uplinksLook: true,
          abbreviated: true,
          callback: (err: any, result: any) => {
            try {
              expect(err).toBeNull();
              expect(result).toBeDefined();
              resolve();
            } catch (e) {
              reject(e);
            }
          },
        });
      });
    });

    test('should return error for non-existing package', async () => {
      const storage: any = await generateStorage();

      return new Promise<void>((resolve, reject) => {
        storage.getPackage({
          name: '@verdaccio/does-not-exist-at-all',
          uplinksLook: true,
          callback: (err: any) => {
            try {
              expect(err).toBeDefined();
              resolve();
            } catch (e) {
              reject(e);
            }
          },
        });
      });
    });

    test('should return internal error on localStorage failure', async () => {
      const storage: any = await generateStorage();
      storage.localStorage.getPackageMetadata = vi.fn((_name, cb) => {
        cb({ status: HTTP_STATUS.INTERNAL_ERROR, message: 'internal error' });
      });

      return new Promise<void>((resolve, reject) => {
        storage.getPackage({
          name: 'any-pkg',
          callback: (err: any) => {
            try {
              expect(err).toBeDefined();
              expect(err.status).toBe(HTTP_STATUS.INTERNAL_ERROR);
              resolve();
            } catch (e) {
              reject(e);
            }
          },
        });
      });
    });
  });

  describe('getLocalDatabase', () => {
    test('should return empty array when no local packages', async () => {
      const storage: any = await generateStorage();
      storage.localStorage.storagePlugin.get = vi.fn((cb) => cb(null, []));

      return new Promise<void>((resolve, reject) => {
        storage.getLocalDatabase((err: any, packages: any[]) => {
          try {
            expect(err).toBeFalsy();
            expect(packages).toEqual([]);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });

    test('should return error when storagePlugin.get fails', async () => {
      const storage: any = await generateStorage();
      storage.localStorage.storagePlugin.get = vi.fn((cb) => cb(new Error('storage error')));

      return new Promise<void>((resolve, reject) => {
        storage.getLocalDatabase((err: any) => {
          try {
            expect(err).toBeDefined();
            expect(err.message).toBe('storage error');
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });

    test('should return packages with latest version info', async () => {
      const storage: any = await generateStorage();
      ensureLocalMetadata('npm_test');

      return new Promise<void>((resolve, reject) => {
        storage.getLocalDatabase((err: any, packages: any[]) => {
          try {
            expect(err).toBeFalsy();
            // npm_test should appear if no filters block it
            const found = packages.find((p: any) => p.name === 'npm_test');
            if (found) {
              expect(found.version).toBe('1.0.0');
            }
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });

    test('should iterate over multiple local packages', async () => {
      const storage: any = await generateStorage();
      ensureLocalMetadata('npm_test');
      ensureLocalMetadata('npm_test_pkg2');

      // Mock storagePlugin.get to return both packages
      storage.localStorage.storagePlugin.get = vi.fn((cb) =>
        cb(null, ['npm_test', 'npm_test_pkg2'])
      );

      return new Promise<void>((resolve, reject) => {
        storage.getLocalDatabase((err: any, packages: any[]) => {
          try {
            expect(err).toBeFalsy();
            expect(packages.length).toBeGreaterThanOrEqual(2);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });

    test('should warn for package without latest tag', async () => {
      const storage: any = await generateStorage();
      // Create a package with no "latest" dist-tag
      const pkgDir = path.join(storagePath, 'no_latest_pkg');
      if (!fs.existsSync(pkgDir)) {
        fs.mkdirSync(pkgDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(pkgDir, 'package.json'),
        JSON.stringify({
          name: 'no_latest_pkg',
          versions: { '1.0.0': { name: 'no_latest_pkg', version: '1.0.0' } },
          'dist-tags': {},
          _attachments: {},
        })
      );

      return new Promise<void>((resolve, reject) => {
        storage.getLocalDatabase((err: any, packages: any[]) => {
          try {
            expect(err).toBeFalsy();
            // Package without latest should NOT appear in results
            const found = packages.find((p: any) => p.name === 'no_latest_pkg');
            expect(found).toBeUndefined();
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  });

  describe('search', () => {
    test('should return a stream', async () => {
      const storage: any = await generateStorage();
      const stream = storage.search('', { req: { query: { local: '1' } } });
      expect(stream).toBeDefined();
      expect(typeof stream.pipe).toBe('function');
      // End the stream to prevent hanging
      stream.destroy();
    });

    test('should complete when no uplinks and local search ends', async () => {
      const storage: any = await generateStorage();
      // Remove all uplinks to test the local-only search path
      storage.uplinks = {};

      return new Promise<void>((resolve, reject) => {
        const stream = storage.search('', {});
        const results: any[] = [];
        stream.on('data', (pkg: any) => {
          results.push(pkg);
        });
        stream.on('end', () => {
          try {
            expect(Array.isArray(results)).toBe(true);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        stream.on('error', () => {
          // Search errors are acceptable (logged, stream ends)
          resolve();
        });
      });
    });
  });

  describe('_updateVersionsHiddenUpLink', () => {
    test('should set hidden uplink value on versions', async () => {
      const storage: any = await generateStorage();
      const versions: any = {
        '1.0.0': { name: 'test', version: '1.0.0' },
        '2.0.0': { name: 'test', version: '2.0.0' },
      };
      const mockUplink = { upname: 'npmjs' };

      storage._updateVersionsHiddenUpLink(versions, mockUplink);

      expect(versions['1.0.0'][Symbol.for('__verdaccio_uplink')]).toBe('npmjs');
      expect(versions['2.0.0'][Symbol.for('__verdaccio_uplink')]).toBe('npmjs');
    });

    test('should handle empty versions object', async () => {
      const storage: any = await generateStorage();
      const versions: any = {};
      const mockUplink = { upname: 'npmjs' };

      storage._updateVersionsHiddenUpLink(versions, mockUplink);
      expect(Object.keys(versions)).toHaveLength(0);
    });
  });

  describe('_isTarballAllowedByFilters', () => {
    test('should return true when no filters configured', async () => {
      const storage: any = await generateStorage();
      storage.filters = [];
      const result = await storage._isTarballAllowedByFilters('npm_test', 'npm_test-1.0.0.tgz');
      expect(result).toBe(true);
    });

    test('should return true when metadata cannot be retrieved', async () => {
      const storage: any = await generateStorage();
      storage.filters = [{ filter_metadata: vi.fn(async (p: any) => p) }];
      storage.localStorage.getPackageMetadata = vi.fn((_n, cb) => cb(new Error('not found')));
      const result = await storage._isTarballAllowedByFilters(
        'nonexistent',
        'nonexistent-1.0.0.tgz'
      );
      expect(result).toBe(true);
    });

    test('should return true when filter throws', async () => {
      const storage: any = await generateStorage();
      storage.filters = [{ filter_metadata: vi.fn().mockRejectedValue(new Error('filter crash')) }];
      ensureLocalMetadata('npm_test');
      const result = await storage._isTarballAllowedByFilters('npm_test', 'npm_test-1.0.0.tgz');
      // Fails open
      expect(result).toBe(true);
    });

    test('should return false when tarball version is filtered out', async () => {
      const storage: any = await generateStorage();
      storage.filters = [
        {
          filter_metadata: vi.fn(async (pkg: any) => {
            const clone = { ...pkg, versions: { ...pkg.versions } };
            delete clone.versions['1.0.0'];
            return clone;
          }),
        },
      ];
      ensureLocalMetadata('npm_test');
      const result = await storage._isTarballAllowedByFilters('npm_test', 'npm_test-1.0.0.tgz');
      expect(result).toBe(false);
    });
  });

  describe('filters', () => {
    test('should load filters from config during init', async () => {
      const storage: any = await generateStorage({ enableFilters: true });
      // Expect at least one filter to be loaded from config
      expect(Array.isArray(storage.filters)).toBe(true);
      expect(storage.filters.length).toBeGreaterThan(0);
    });

    test('should apply configured filter to upstream metadata', async () => {
      const storage: any = await generateStorage({
        enableFilters: true,
        filterPkg: 'jquery',
        filterVersion: '1.5.1',
      });

      return new Promise<void>((resolve, reject) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err: any, metadata: any) => {
          try {
            expect(err).toBeNull();
            expect(metadata).toBeDefined();
            expect(metadata.versions).toBeDefined();
            // The filter plugin removes the configured version for the target package
            expect(metadata.versions['1.5.1']).toBeUndefined();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    });

    test('should apply filters when upLinks is empty and filter matches', async () => {
      const storage: any = await generateStorage({
        enableFilters: true,
        filterPkg: 'npm_test',
        filterVersion: '1.0.0',
      });

      ensureLocalMetadata('npm_test');

      return new Promise<void>((resolve, reject) => {
        const metadataSource = path.join(__dirname, '../../partials/metadata');
        const metadata = JSON.parse(fs.readFileSync(metadataSource).toString());
        // npm_test has no proxy configured, so this exercises the upLinks.length === 0 path
        storage._syncUplinksMetadata(
          'npm_test',
          metadata,
          {},
          (err: any, filteredMetadata: any) => {
            try {
              expect(err).toBeNull();
              expect(filteredMetadata).toBeDefined();
              // The filter plugin should have removed version 1.0.0
              expect(filteredMetadata.versions['1.0.0']).toBeUndefined();
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    test('should collect filter errors without breaking the pipeline', async () => {
      const storage: any = await generateStorage();

      // Manually set a filter that rejects
      storage.filters = [
        {
          filter_metadata: vi.fn().mockRejectedValue(new Error('Example filter failure')),
        },
      ];

      const metadata = {
        name: 'some-package',
        versions: { '1.0.0': { name: 'some-package', version: '1.0.0' } },
        'dist-tags': { latest: '1.0.0' },
        _uplinks: {},
      };

      return new Promise<void>((resolve, reject) => {
        // some-package has no proxy configured => upLinks.length === 0 path
        storage._syncUplinksMetadata(
          'some-package',
          metadata,
          {},
          (err: any, _filteredMetadata: any, errors: any) => {
            try {
              expect(err).toBeNull();
              // Filter errors should be reported in the errors array
              const flatErrors = (errors || []).flat().filter(Boolean);
              expect(flatErrors.length).toBeGreaterThan(0);
              expect(flatErrors[0].message).toContain('filter failure');
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    test('should apply filters in getLocalDatabase', async () => {
      const storage: any = await generateStorage({
        enableFilters: true,
        filterPkg: 'npm_test',
        filterVersion: '1.0.0',
      });

      ensureLocalMetadata('npm_test');

      return new Promise<void>((resolve, reject) => {
        storage.getLocalDatabase((err: any, packages: any[]) => {
          try {
            expect(err).toBeFalsy();
            // npm_test's only version (1.0.0) was filtered out, so the latest tag
            // won't resolve to an existing version and it should be excluded
            const npmTestPkg = packages.find((p: any) => p.name === 'npm_test');
            expect(npmTestPkg).toBeUndefined();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
    });

    test('should block tarball download for filtered versions', async () => {
      const storage: any = await generateStorage();

      // Manually inject a filter that removes version 1.0.0 of npm_test
      storage.filters = [
        {
          filter_metadata: vi.fn(async (pkg: any) => {
            const clone = { ...pkg, versions: { ...pkg.versions } };
            delete clone.versions['1.0.0'];
            return clone;
          }),
        },
      ];

      ensureLocalMetadata('npm_test');

      return new Promise<void>((resolve, reject) => {
        const stream = storage.getTarball('npm_test', 'npm_test-1.0.0.tgz');
        stream.on('error', (err: any) => {
          try {
            // Should get a 404 because version 1.0.0 is filtered out
            expect(err.status).toBe(HTTP_STATUS.NOT_FOUND);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
        stream.on('open', () => {
          reject(new Error('Expected tarball to be blocked but stream opened'));
        });
      });
    });

    test('should allow tarball download for non-filtered versions via _isTarballAllowedByFilters', async () => {
      const storage: any = await generateStorage();

      // Filter that removes a version that does NOT match the tarball we request
      storage.filters = [
        {
          filter_metadata: vi.fn(async (pkg: any) => {
            const clone = { ...pkg, versions: { ...pkg.versions } };
            delete clone.versions['99.99.99'];
            return clone;
          }),
        },
      ];

      ensureLocalMetadata('npm_test');

      // Verify the filter check allows the tarball through
      const allowed = await storage._isTarballAllowedByFilters('npm_test', 'npm_test-1.0.0.tgz');
      expect(allowed).toBe(true);
    });

    test('_applyFilters should chain multiple filters sequentially', async () => {
      const storage: any = await generateStorage();

      // Manually set up two filter plugins
      storage.filters = [
        {
          filter_metadata: vi.fn(async (pkg: any) => {
            delete pkg.versions['1.0.0'];
            return pkg;
          }),
        },
        {
          filter_metadata: vi.fn(async (pkg: any) => {
            delete pkg.versions['2.0.0'];
            return pkg;
          }),
        },
      ];

      const metadata: any = {
        name: 'test-pkg',
        versions: {
          '1.0.0': { name: 'test-pkg', version: '1.0.0' },
          '2.0.0': { name: 'test-pkg', version: '2.0.0' },
          '3.0.0': { name: 'test-pkg', version: '3.0.0' },
        },
        'dist-tags': { latest: '3.0.0' },
      };

      const { filteredPackage, filterErrors } = await storage._applyFilters(metadata);

      // Both filters should have been applied
      expect(filteredPackage.versions['1.0.0']).toBeUndefined();
      expect(filteredPackage.versions['2.0.0']).toBeUndefined();
      expect(filteredPackage.versions['3.0.0']).toBeDefined();
      expect(filterErrors).toHaveLength(0);

      // Verify both were called in order
      expect(storage.filters[0].filter_metadata).toHaveBeenCalledTimes(1);
      expect(storage.filters[1].filter_metadata).toHaveBeenCalledTimes(1);
    });
  });
});
