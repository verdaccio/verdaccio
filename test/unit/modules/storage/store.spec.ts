import fs from 'fs';
import getPort from 'get-port';
import path from 'path';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { fileUtils } from '@verdaccio/core';
import { Config } from '@verdaccio/types';

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
};

const generateStorage = async function (port = mockServerPort, opts: GenerateStorageOptions = {}) {
  const { enableFilters = false, filterPkg = 'jquery', filterVersion = '1.5.1' } = opts;

  const baseConfig: any = {
    self_path: __dirname,
    storage: storagePath,
    uplinks: {
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
