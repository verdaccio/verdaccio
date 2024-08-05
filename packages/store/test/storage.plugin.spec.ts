import MockDate from 'mockdate';
import nock from 'nock';
import path from 'path';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { DIST_TAGS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import { Manifest } from '@verdaccio/types';

import { Storage } from '../src';
import { configExample, generateRandomStorage, getConfig } from './helpers';

const logger = setup({ type: 'stdout', format: 'pretty', level: 'trace' });

const pluginsPartialsFolder = path.join(__dirname, './fixtures/plugins');

describe('storage plugin', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.abortPendingRequests();
    jest.clearAllMocks();
  });

  describe('Plugin Legacy Support', () => {
    test('should return no results from a legacy plugin', async () => {
      const configJSON = getConfig('storage/plugin-legacy.yaml');
      const config = new Config(
        configExample({
          ...configJSON,
          plugins: pluginsPartialsFolder,
          storage: generateRandomStorage(),
        })
      );

      const storage = new Storage(config, logger);
      await storage.init(config);
      await expect(storage.getLocalDatabase()).resolves.toHaveLength(1);
    });
    test('create private package', async () => {
      const mockDate = '2018-01-14T11:17:40.712Z';
      MockDate.set(mockDate);
      const configJSON = getConfig('storage/plugin-publish-legacy.yaml');
      const pkgName = 'upstream';
      const requestOptions = {
        host: 'localhost',
        protocol: 'http',
        headers: {},
      };
      const config = new Config(
        configExample({
          ...getDefaultConfig(),
          ...configJSON,
          plugins: pluginsPartialsFolder,
          storage: generateRandomStorage(),
        })
      );
      const storage = new Storage(config, logger);
      await storage.init(config);
      const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
      await storage.updateManifest(bodyNewManifest, {
        signal: new AbortController().signal,
        name: pkgName,
        uplinksLook: true,
        revision: '1',
        requestOptions,
      });
      const manifest = (await storage.getPackageByOptions({
        name: pkgName,
        uplinksLook: true,
        requestOptions,
      })) as Manifest;
      expect(manifest.name).toEqual(pkgName);
      expect(manifest._id).toEqual(pkgName);
      expect(Object.keys(manifest.versions)).toEqual(['1.0.0']);
      expect(manifest.time).toEqual({
        '1.0.0': mockDate,
        created: mockDate,
        modified: mockDate,
      });
      expect(manifest[DIST_TAGS]).toEqual({ latest: '1.0.0' });
      // verdaccio keeps latest version of readme on manifest level but not by version
      expect(manifest.versions['1.0.0'].readme).not.toBeDefined();
      expect(manifest.readme).toEqual('# test');
      expect(manifest._attachments).toEqual({});
      expect(typeof manifest._rev).toBeTruthy();
    });
  });
});
