import nock from 'nock';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { API_ERROR, DIST_TAGS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import {
  generateLocalPackageMetadata,
  generatePackageMetadata,
  generateRemotePackageMetadata,
} from '@verdaccio/test-helper';
import { Manifest } from '@verdaccio/types';

import { Storage } from '../src';
import manifestFooRemoteNpmjs from './fixtures/manifests/foo-npmjs.json';
import { configExample, generateRandomStorage } from './helpers';

const logger = setup({ type: 'stdout', format: 'pretty', level: 'trace' });

const fooManifest = generatePackageMetadata('foo', '1.0.0');

describe('storage', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.abortPendingRequests();
    jest.clearAllMocks();
  });

  describe('syncUplinksMetadata()', () => {
    describe('error handling', () => {
      test('should handle double failure on uplinks with timeout', async () => {
        const fooManifest = generatePackageMetadata('timeout', '8.0.0');
        nock('https://registry.timeout.com')
          .get(`/${fooManifest.name}`)
          .delayConnection(8000)
          .reply(201, manifestFooRemoteNpmjs);

        const config = new Config(
          configExample(
            {
              storage: generateRandomStorage(),
            },
            './fixtures/config/syncDoubleUplinksMetadata.yaml',
            __dirname
          )
        );

        const storage = new Storage(config, logger);
        await storage.init(config);
        await expect(
          storage.syncUplinksMetadata(fooManifest.name, null, {
            retry: { limit: 3 },
            timeout: {
              request: 1000,
            },
          })
        ).rejects.toThrow(API_ERROR.NO_PACKAGE);
      }, 18000);

      test('should handle one proxy fails', async () => {
        const fooManifest = generatePackageMetadata('foo', '8.0.0');
        nock('https://registry.verdaccio.org').get('/foo').replyWithError('service in holidays');
        const config = new Config(
          configExample(
            {
              storage: generateRandomStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
        await storage.init(config);
        await expect(
          storage.syncUplinksMetadata(fooManifest.name, null, {
            retry: { limit: 0 },
          })
        ).rejects.toThrow(API_ERROR.NO_PACKAGE);
      });

      test('should handle one proxy reply 304', async () => {
        const fooManifest = generatePackageMetadata('foo-no-data', '8.0.0');
        nock('https://registry.verdaccio.org').get('/foo-no-data').reply(304);
        const config = new Config(
          configExample(
            {
              storage: generateRandomStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
        await storage.init(config);
        const [manifest] = await storage.syncUplinksMetadata(fooManifest.name, fooManifest, {
          retry: { limit: 0 },
        });
        expect(manifest).toBe(fooManifest);
      });
    });

    describe('success scenarios', () => {
      test('should handle one proxy success', async () => {
        const fooManifest = generateLocalPackageMetadata('foo', '8.0.0');
        nock('https://registry.verdaccio.org').get('/foo').reply(201, manifestFooRemoteNpmjs);
        const config = new Config(
          configExample(
            {
              storage: generateRandomStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
        await storage.init(config);

        const [response] = await storage.syncUplinksMetadata(fooManifest.name, fooManifest);
        expect(response).not.toBeNull();
        expect((response as Manifest).name).toEqual(fooManifest.name);
        expect(Object.keys((response as Manifest).versions)).toEqual([
          '8.0.0',
          '1.0.0',
          '0.0.3',
          '0.0.4',
          '0.0.5',
          '0.0.6',
          '0.0.7',
        ]);
        expect(Object.keys((response as Manifest).time)).toEqual([
          'modified',
          'created',
          '8.0.0',
          '1.0.0',
          '0.0.3',
          '0.0.4',
          '0.0.5',
          '0.0.6',
          '0.0.7',
        ]);
        expect((response as Manifest)[DIST_TAGS].latest).toEqual('8.0.0');
        expect((response as Manifest).time['8.0.0']).toBeDefined();
      });

      test('should handle one proxy success with no local cache manifest', async () => {
        nock('https://registry.verdaccio.org').get('/foo').reply(201, manifestFooRemoteNpmjs);
        const config = new Config(
          configExample(
            {
              storage: generateRandomStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
        await storage.init(config);

        const [response] = await storage.syncUplinksMetadata(fooManifest.name, null);
        // the latest from the remote manifest
        expect(response).not.toBeNull();
        expect((response as Manifest).name).toEqual(fooManifest.name);
        expect((response as Manifest)[DIST_TAGS].latest).toEqual('0.0.7');
      });

      test('should handle no proxy found with local cache manifest', async () => {
        const fooManifest = generatePackageMetadata('foo', '8.0.0');
        nock('https://registry.verdaccio.org').get('/foo').reply(201, manifestFooRemoteNpmjs);
        const config = new Config(
          configExample(
            {
              storage: generateRandomStorage(),
            },
            './fixtures/config/syncNoUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
        await storage.init(config);

        const [response] = await storage.syncUplinksMetadata(fooManifest.name, fooManifest);
        expect(response).not.toBeNull();
        expect((response as Manifest).name).toEqual(fooManifest.name);
        expect((response as Manifest)[DIST_TAGS].latest).toEqual('8.0.0');
      });
      test.todo('should handle double proxy with last one success');
    });

    describe('options', () => {
      test('should handle disable uplinks via options.uplinksLook=false with cache', async () => {
        const fooManifest = generatePackageMetadata('foo', '8.0.0');
        nock('https://registry.verdaccio.org').get('/foo').reply(201, manifestFooRemoteNpmjs);
        const config = new Config(
          configExample(
            {
              storage: generateRandomStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
        await storage.init(config);

        const [response] = await storage.syncUplinksMetadata(fooManifest.name, fooManifest, {
          uplinksLook: false,
        });

        expect((response as Manifest).name).toEqual(fooManifest.name);
        expect((response as Manifest)[DIST_TAGS].latest).toEqual('8.0.0');
      });

      test('should handle disable uplinks via options.uplinksLook=false without cache', async () => {
        const fooRemoteManifest = generateRemotePackageMetadata(
          'foo',
          '9.0.0',
          'https://registry.verdaccio.org',
          ['9.0.0', '9.0.1', '9.0.2', '9.0.3']
        );
        nock('https://registry.verdaccio.org').get('/foo').reply(201, fooRemoteManifest);
        const config = new Config(
          configExample(
            {
              ...getDefaultConfig(),
              storage: generateRandomStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
        await storage.init(config);

        const [response] = await storage.syncUplinksMetadata('foo', null, {
          uplinksLook: true,
        });

        expect((response as Manifest).name).toEqual('foo');
        expect((response as Manifest)[DIST_TAGS].latest).toEqual('9.0.0');
      });
    });
  });
});
