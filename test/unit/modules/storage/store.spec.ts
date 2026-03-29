import fs from 'fs';
import getPort from 'get-port';
import nock from 'nock';
import path from 'path';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { fileUtils } from '@verdaccio/core';
import type { Config } from '@verdaccio/types';

import AppConfig from '../../../../src/lib/config';
import { API_ERROR, HTTP_STATUS } from '../../../../src/lib/constants';
import { setup } from '../../../../src/lib/logger';
import Storage from '../../../../src/lib/storage';
import { mockServer } from '../../__helper/mock';
import configExample from '../../partials/config';

setup({});

vi.setConfig({ testTimeout: 10000 });

const mockServerPort = await getPort();
const storagePath = await fileUtils.createTempStorageFolder('htpasswd-web-api');

// Configure the plugins folder absolutely so the async loader resolves local test plugins
const PLUGINS_DIR = path.join(__dirname, '..', 'api', 'partials', 'plugin');
// The filter plugin id (short name). Loader will look for `${prefix}-${id}` within PLUGINS_DIR
const FILTER_PLUGIN_ID = 'filter';

type GenerateStorageOptions = {
  enableFilters?: boolean;
  filterPkg?: string;
  filterVersion?: string;
  storagePath?: string;
  uplinks?: Record<string, { url: string }>;
};

const generateStorage = async function (port = mockServerPort, opts: GenerateStorageOptions = {}) {
  const {
    enableFilters = false,
    filterPkg = 'jquery',
    filterVersion = '1.5.1',
    storagePath: customStoragePath,
    uplinks: customUplinks,
  } = opts;

  const baseConfig: any = {
    self_path: __dirname,
    storage: customStoragePath || storagePath,
    uplinks: customUplinks || {
      npmjs: {
        url: `http://localhost:${port}`,
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

describe('StorageTest', () => {
  let mockRegistry: any;

  beforeAll(async () => {
    mockRegistry = await mockServer(mockServerPort).init();
  });

  afterAll(function () {
    mockRegistry[0].stop();
  });

  test('should be defined', async () => {
    const storage: any = await generateStorage();

    expect(storage).toBeDefined();
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
          expect(errors[0][0].statusCode).toBe(HTTP_STATUS.INTERNAL_ERROR);
          expect(errors[0][0].message).toMatch(API_ERROR.BAD_STATUS_CODE);
          resolve(true);
        });
      });
    });

    test('should not touch if the package exists and has no uplinks', async () => {
      const storage: any = (await generateStorage()) as any;
      const metadataSource = path.join(__dirname, '../../partials/metadata');
      const metadataPath = path.join(storagePath, 'npm_test/package.json');

      fs.mkdirSync(path.join(storagePath, 'npm_test'));
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

  describe('getTarball uplink validation', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    test('should reject tarball fetch when tarball URL does not match uplink origin', async () => {
      const rejectStoragePath = await fileUtils.createTempStorageFolder('tarball-reject-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: rejectStoragePath,
      });

      // First sync metadata so the package exists locally
      await new Promise<void>((resolve) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err: any) => {
          expect(err).toBeNull();
          resolve();
        });
      });

      // Inject a distfile pointing to a different host
      await new Promise<void>((resolve) => {
        storage.localStorage.getPackageMetadata('jquery', (err: any, info: any) => {
          expect(err).toBeNull();
          info._distfiles['jquery-1.5.1.tgz'] = {
            url: 'http://other-host.example.com/jquery-1.5.1.tgz',
            sha: 'fake-sha',
          };
          storage.localStorage._writePackage('jquery', info, () => resolve());
        });
      });

      return new Promise<void>((resolve) => {
        const stream = storage.getTarball('jquery', 'jquery-1.5.1.tgz');
        stream.on('error', (err: any) => {
          expect(err).toBeDefined();
          expect(err.message).toMatch(/tarball URL origin does not match any configured uplink/);
          expect(err.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
          resolve();
        });
      });
    });

    test('should allow tarball fetch when URL matches configured uplink origin', async () => {
      const tarballPath = path.join(__dirname, '../uplinks/__fixtures__', 'jquery-1.5.1.tgz');
      const tarballSize = fs.statSync(tarballPath).size;

      const allowStoragePath = await fileUtils.createTempStorageFolder('tarball-allow-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: allowStoragePath,
      });

      // Sync metadata
      await new Promise<void>((resolve) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err: any) => {
          expect(err).toBeNull();
          resolve();
        });
      });

      nock(`http://localhost:${mockServerPort}`)
        .get('/jquery/-/jquery-1.5.1.tgz')
        .replyWithFile(200, tarballPath, {
          'Content-Type': 'application/octet-stream',
          'Content-Length': tarballSize.toString(),
        });

      // Inject a same-origin distfile (matching the uplink)
      await new Promise<void>((resolve) => {
        storage.localStorage.getPackageMetadata('jquery', (err: any, info: any) => {
          expect(err).toBeNull();
          info._distfiles['jquery-1.5.1.tgz'] = {
            url: `http://localhost:${mockServerPort}/jquery/-/jquery-1.5.1.tgz`,
            sha: '2ae2d661e906c1a01e044a71bb5b2743942183e5',
          };
          storage.localStorage._writePackage('jquery', info, () => resolve());
        });
      });

      return new Promise<void>((resolve, reject) => {
        const stream = storage.getTarball('jquery', 'jquery-1.5.1.tgz');
        stream.on('error', (err: any) => {
          reject(err);
        });
        stream.on('content-length', () => {
          resolve();
        });
      });
    });
  });

  describe('updateVersions tarball origin validation', () => {
    test('should skip _distfiles entry when tarball host differs from uplink', async () => {
      const distStoragePath = await fileUtils.createTempStorageFolder('distfiles-reject-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: distStoragePath,
      });

      const packageInfo: any = {
        name: 'test-pkg-reject',
        versions: {
          '1.0.0': {
            name: 'test-pkg-reject',
            version: '1.0.0',
            dist: {
              shasum: 'abc123',
              tarball: 'http://other-host.example.com/test-pkg-reject-1.0.0.tgz',
            },
            [Symbol.for('__verdaccio_uplink')]: 'npmjs',
          },
        },
        'dist-tags': { latest: '1.0.0' },
        _uplinks: {},
      };

      await new Promise<void>((resolve, reject) => {
        storage.localStorage.updateVersions(
          'test-pkg-reject',
          packageInfo,
          (err: any, result: any) => {
            try {
              expect(err).toBeNull();
              expect(result).toBeDefined();
              expect(result._distfiles).toBeDefined();
              expect(Object.keys(result._distfiles).length).toBe(0);
              resolve();
            } catch (e) {
              reject(e);
            }
          }
        );
      });
    });

    test('should accept _distfiles entry when tarball host matches uplink', async () => {
      const distStoragePath2 = await fileUtils.createTempStorageFolder('distfiles-allow-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: distStoragePath2,
      });

      const packageInfo: any = {
        name: 'test-pkg-allow',
        versions: {
          '1.0.0': {
            name: 'test-pkg-allow',
            version: '1.0.0',
            dist: {
              shasum: 'abc123',
              tarball: `http://localhost:${mockServerPort}/test-pkg-allow/-/test-pkg-allow-1.0.0.tgz`,
            },
            [Symbol.for('__verdaccio_uplink')]: 'npmjs',
          },
        },
        'dist-tags': { latest: '1.0.0' },
        _uplinks: {},
      };

      await new Promise<void>((resolve, reject) => {
        storage.localStorage.updateVersions(
          'test-pkg-allow',
          packageInfo,
          (err: any, result: any) => {
            try {
              expect(err).toBeNull();
              expect(result).toBeDefined();
              expect(result._distfiles).toBeDefined();
              expect(Object.keys(result._distfiles).length).toBe(1);
              expect(result._distfiles['test-pkg-allow-1.0.0.tgz']).toBeDefined();
              resolve();
            } catch (e) {
              reject(e);
            }
          }
        );
      });
    });

    test('should accept tarball URL that matches a different configured uplink (cross-uplink)', async () => {
      // Simulates the yarn registry case: metadata comes from one uplink but
      // tarball URL points to another configured uplink (e.g. npmjs).
      const crossPort = await getPort();
      const crossStoragePath = await fileUtils.createTempStorageFolder('cross-uplink-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: crossStoragePath,
        uplinks: {
          npmjs: {
            url: `http://localhost:${mockServerPort}`,
          },
          yarn: {
            url: `http://localhost:${crossPort}`,
          },
        },
      });

      // Metadata served by 'yarn' uplink, but tarball URL points to 'npmjs' host
      const packageInfo: any = {
        name: 'cross-uplink-pkg',
        versions: {
          '1.0.0': {
            name: 'cross-uplink-pkg',
            version: '1.0.0',
            dist: {
              shasum: 'abc123',
              tarball: `http://localhost:${mockServerPort}/cross-uplink-pkg/-/cross-uplink-pkg-1.0.0.tgz`,
            },
            [Symbol.for('__verdaccio_uplink')]: 'yarn',
          },
        },
        'dist-tags': { latest: '1.0.0' },
        _uplinks: {},
      };

      await new Promise<void>((resolve, reject) => {
        storage.localStorage.updateVersions(
          'cross-uplink-pkg',
          packageInfo,
          (err: any, result: any) => {
            try {
              expect(err).toBeNull();
              expect(result._distfiles).toBeDefined();
              expect(Object.keys(result._distfiles).length).toBe(1);
              expect(result._distfiles['cross-uplink-pkg-1.0.0.tgz']).toBeDefined();
              resolve();
            } catch (e) {
              reject(e);
            }
          }
        );
      });
    });

    test('should accept _distfiles when version has no uplink marker (local publish)', async () => {
      const localPubPath = await fileUtils.createTempStorageFolder('local-publish-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: localPubPath,
      });

      // Locally published packages have no __verdaccio_uplink symbol
      const packageInfo: any = {
        name: 'local-pkg',
        versions: {
          '1.0.0': {
            name: 'local-pkg',
            version: '1.0.0',
            dist: {
              shasum: 'abc123',
              tarball: 'http://localhost:4873/local-pkg/-/local-pkg-1.0.0.tgz',
            },
          },
        },
        'dist-tags': { latest: '1.0.0' },
        _uplinks: {},
      };

      await new Promise<void>((resolve, reject) => {
        storage.localStorage.updateVersions('local-pkg', packageInfo, (err: any, result: any) => {
          try {
            expect(err).toBeNull();
            expect(result._distfiles).toBeDefined();
            // No uplink marker means no origin check — should be accepted
            expect(Object.keys(result._distfiles).length).toBe(1);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });

    test('should reject tarball pointing to internal IP when no uplink matches', async () => {
      const internalPath = await fileUtils.createTempStorageFolder('internal-ip-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: internalPath,
      });

      const packageInfo: any = {
        name: 'internal-pkg',
        versions: {
          '1.0.0': {
            name: 'internal-pkg',
            version: '1.0.0',
            dist: {
              shasum: 'abc123',
              tarball: 'http://169.254.169.254/latest/meta-data/',
            },
            [Symbol.for('__verdaccio_uplink')]: 'npmjs',
          },
        },
        'dist-tags': { latest: '1.0.0' },
        _uplinks: {},
      };

      await new Promise<void>((resolve, reject) => {
        storage.localStorage.updateVersions(
          'internal-pkg',
          packageInfo,
          (err: any, result: any) => {
            try {
              expect(err).toBeNull();
              expect(result._distfiles).toBeDefined();
              expect(Object.keys(result._distfiles).length).toBe(0);
              resolve();
            } catch (e) {
              reject(e);
            }
          }
        );
      });
    });

    test('should only accept valid versions and skip off-origin ones in mixed metadata', async () => {
      const mixedPath = await fileUtils.createTempStorageFolder('mixed-versions-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: mixedPath,
      });

      const packageInfo: any = {
        name: 'mixed-pkg',
        versions: {
          '1.0.0': {
            name: 'mixed-pkg',
            version: '1.0.0',
            dist: {
              shasum: 'abc123',
              tarball: `http://localhost:${mockServerPort}/mixed-pkg/-/mixed-pkg-1.0.0.tgz`,
            },
            [Symbol.for('__verdaccio_uplink')]: 'npmjs',
          },
          '2.0.0': {
            name: 'mixed-pkg',
            version: '2.0.0',
            dist: {
              shasum: 'def456',
              tarball: 'http://attacker.example.com/mixed-pkg-2.0.0.tgz',
            },
            [Symbol.for('__verdaccio_uplink')]: 'npmjs',
          },
          '3.0.0': {
            name: 'mixed-pkg',
            version: '3.0.0',
            dist: {
              shasum: 'ghi789',
              tarball: `http://localhost:${mockServerPort}/mixed-pkg/-/mixed-pkg-3.0.0.tgz`,
            },
            [Symbol.for('__verdaccio_uplink')]: 'npmjs',
          },
        },
        'dist-tags': { latest: '3.0.0' },
        _uplinks: {},
      };

      await new Promise<void>((resolve, reject) => {
        storage.localStorage.updateVersions('mixed-pkg', packageInfo, (err: any, result: any) => {
          try {
            expect(err).toBeNull();
            expect(result._distfiles).toBeDefined();
            // Only v1.0.0 and v3.0.0 should be accepted; v2.0.0 is off-origin
            expect(Object.keys(result._distfiles).length).toBe(2);
            expect(result._distfiles['mixed-pkg-1.0.0.tgz']).toBeDefined();
            expect(result._distfiles['mixed-pkg-2.0.0.tgz']).toBeUndefined();
            expect(result._distfiles['mixed-pkg-3.0.0.tgz']).toBeDefined();
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  });

  describe('filters', () => {
    test('should load filters from config during init', async () => {
      const storage: any = await generateStorage(mockServerPort, { enableFilters: true });
      // Expect at least one filter to be loaded from config
      expect(Array.isArray(storage.filters)).toBe(true);
      expect(storage.filters.length).toBeGreaterThan(0);
    });

    test('should apply configured filter to upstream metadata', async () => {
      const storage: any = await generateStorage(mockServerPort, {
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
  });
});
