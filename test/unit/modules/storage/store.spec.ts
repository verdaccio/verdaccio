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
  packages?: Record<string, any>;
};

const generateStorage = async function (port = mockServerPort, opts: GenerateStorageOptions = {}) {
  const {
    enableFilters = false,
    filterPkg = 'jquery',
    filterVersion = '1.5.1',
    storagePath: customStoragePath,
    uplinks: customUplinks,
    packages: customPackages,
  } = opts;

  const baseConfig: any = {
    self_path: __dirname,
    storage: customStoragePath || storagePath,
    uplinks: customUplinks || {
      npmjs: {
        url: `http://localhost:${port}`,
      },
    },
    ...(customPackages ? { packages: customPackages } : {}),
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

    test('should reject tarball when URL origin does not match authorized uplink', async () => {
      const rejectStoragePath = await fileUtils.createTempStorageFolder('tarball-reject-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: rejectStoragePath,
      });

      await new Promise<void>((resolve) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err: any) => {
          expect(err).toBeNull();
          resolve();
        });
      });

      // Inject a distfile pointing to a host not matching any uplink
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
          expect(err.message).toMatch(/tarball URL origin does not match the configured uplink/);
          expect(err.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
          resolve();
        });
      });
    });

    test('should allow tarball when URL matches the authorized uplink origin', async () => {
      const tarballPath = path.join(__dirname, '../uplinks/__fixtures__', 'jquery-1.5.1.tgz');
      const tarballSize = fs.statSync(tarballPath).size;

      const allowStoragePath = await fileUtils.createTempStorageFolder('tarball-allow-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: allowStoragePath,
      });

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

    test('should reject tarball pointing to internal IP', async () => {
      const internalPath = await fileUtils.createTempStorageFolder('internal-ip-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: internalPath,
      });

      await new Promise<void>((resolve) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err: any) => {
          expect(err).toBeNull();
          resolve();
        });
      });

      await new Promise<void>((resolve) => {
        storage.localStorage.getPackageMetadata('jquery', (err: any, info: any) => {
          expect(err).toBeNull();
          info._distfiles['jquery-1.5.1.tgz'] = {
            url: 'http://169.254.169.254/latest/meta-data/',
            sha: 'fake-sha',
          };
          storage.localStorage._writePackage('jquery', info, () => resolve());
        });
      });

      return new Promise<void>((resolve) => {
        const stream = storage.getTarball('jquery', 'jquery-1.5.1.tgz');
        stream.on('error', (err: any) => {
          expect(err).toBeDefined();
          expect(err.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
          resolve();
        });
      });
    });

    test('should return 404 when package has no proxy access configured', async () => {
      // npm_test in store.spec.yaml has no proxy setting
      const noProxyPath = await fileUtils.createTempStorageFolder('no-proxy-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: noProxyPath,
      });

      // Create a local package with a distfile
      await new Promise<void>((resolve, reject) => {
        const packageInfo: any = {
          name: 'npm_test',
          versions: {
            '1.0.0': {
              name: 'npm_test',
              version: '1.0.0',
              dist: {
                shasum: 'abc123',
                tarball: `http://localhost:${mockServerPort}/npm_test/-/npm_test-1.0.0.tgz`,
              },
            },
          },
          'dist-tags': { latest: '1.0.0' },
          _uplinks: {},
        };
        storage.localStorage.updateVersions('npm_test', packageInfo, (err: any) => {
          err ? reject(err) : resolve();
        });
      });

      return new Promise<void>((resolve) => {
        const stream = storage.getTarball('npm_test', 'npm_test-1.0.0.tgz');
        stream.on('error', (err: any) => {
          expect(err).toBeDefined();
          // No proxy configured for npm_test → 404
          expect(err.statusCode).toBe(HTTP_STATUS.NOT_FOUND);
          resolve();
        });
      });
    });
  });

  describe('getTarball package access and proxy rules', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    test('should allow tarball when URL matches one of multiple proxy uplinks', async () => {
      // Simulates: packages.proxy lists both npmjs and yarn,
      // tarball URL points to npmjs
      const tarballPath = path.join(__dirname, '../uplinks/__fixtures__', 'jquery-1.5.1.tgz');
      const tarballSize = fs.statSync(tarballPath).size;
      const yarnPort = await getPort();

      const crossStoragePath = await fileUtils.createTempStorageFolder('cross-uplink-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: crossStoragePath,
        uplinks: {
          npmjs: {
            url: `http://localhost:${mockServerPort}`,
          },
          yarn: {
            url: `http://localhost:${yarnPort}`,
          },
        },
        packages: {
          jquery: {
            access: '$all',
            publish: '$all',
            proxy: 'yarn npmjs',
          },
        },
      });

      // Mock yarn uplink serving metadata
      nock(`http://localhost:${yarnPort}`)
        .get('/jquery')
        .reply(
          200,
          JSON.parse(
            fs.readFileSync(
              path.join(__dirname, '../../partials/mock-store/jquery/package.json'),
              'utf8'
            )
          )
        );

      await new Promise<void>((resolve) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err: any) => {
          expect(err).toBeNull();
          resolve();
        });
      });

      // Tarball URL points to npmjs, which is an authorized proxy for jquery
      nock(`http://localhost:${mockServerPort}`)
        .get('/jquery/-/jquery-1.5.1.tgz')
        .replyWithFile(200, tarballPath, {
          'Content-Type': 'application/octet-stream',
          'Content-Length': tarballSize.toString(),
        });

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

    test('should reject tarball when URL matches uplink that is NOT in proxy list for this package', async () => {
      // Simulates: packages.proxy only lists yarn for jquery,
      // but tarball URL points to npmjs — should be rejected even though
      // npmjs is a configured uplink
      const yarnPort = await getPort();

      const noAccessPath = await fileUtils.createTempStorageFolder('no-access-uplink-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: noAccessPath,
        uplinks: {
          npmjs: {
            url: `http://localhost:${mockServerPort}`,
          },
          yarn: {
            url: `http://localhost:${yarnPort}`,
          },
        },
        packages: {
          jquery: {
            access: '$all',
            publish: '$all',
            proxy: 'yarn',
          },
        },
      });

      // Mock yarn serving metadata
      nock(`http://localhost:${yarnPort}`)
        .get('/jquery')
        .reply(
          200,
          JSON.parse(
            fs.readFileSync(
              path.join(__dirname, '../../partials/mock-store/jquery/package.json'),
              'utf8'
            )
          )
        );

      await new Promise<void>((resolve) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err: any) => {
          expect(err).toBeNull();
          resolve();
        });
      });

      // Tarball URL points to npmjs, but only yarn has proxy access for jquery
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

      return new Promise<void>((resolve) => {
        const stream = storage.getTarball('jquery', 'jquery-1.5.1.tgz');
        stream.on('error', (err: any) => {
          expect(err).toBeDefined();
          expect(err.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
          resolve();
        });
      });
    });

    test('should reject tarball when URL does not match any authorized uplink among multiple', async () => {
      const yarnPort = await getPort();
      const multiPath = await fileUtils.createTempStorageFolder('multi-uplink-reject-test');
      const storage: any = await generateStorage(mockServerPort, {
        storagePath: multiPath,
        uplinks: {
          npmjs: {
            url: `http://localhost:${mockServerPort}`,
          },
          yarn: {
            url: `http://localhost:${yarnPort}`,
          },
        },
      });

      await new Promise<void>((resolve) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err: any) => {
          expect(err).toBeNull();
          resolve();
        });
      });

      // Inject a distfile pointing to a host that matches no uplink at all
      await new Promise<void>((resolve) => {
        storage.localStorage.getPackageMetadata('jquery', (err: any, info: any) => {
          expect(err).toBeNull();
          info._distfiles['jquery-1.5.1.tgz'] = {
            url: 'http://unknown-registry.example.com/jquery-1.5.1.tgz',
            sha: 'fake-sha',
          };
          storage.localStorage._writePackage('jquery', info, () => resolve());
        });
      });

      return new Promise<void>((resolve) => {
        const stream = storage.getTarball('jquery', 'jquery-1.5.1.tgz');
        stream.on('error', (err: any) => {
          expect(err).toBeDefined();
          expect(err.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
          resolve();
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
