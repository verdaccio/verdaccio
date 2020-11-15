import path from 'path';
import fs from 'fs';
import { Writable } from 'stream';
import { Config as AppConfig } from '@verdaccio/config';
import { Storage } from '@verdaccio/store';
import { IStorageHandler } from '@verdaccio/store';

import { Config } from '@verdaccio/types';
import { API_ERROR, HTTP_STATUS } from '@verdaccio/commons-api';
import { mockServer, configExample, DOMAIN_SERVERS, generateRamdonStorage } from '@verdaccio/mock';

import { setup, logger } from '@verdaccio/logger';

setup([]);

const mockServerPort = 55548;

const generateStorage = async function () {
  const storagePath = generateRamdonStorage();
  const storageConfig = configExample(
    {
      config_path: storagePath,
      storage: storagePath,
      uplinks: {
        npmjs: {
          url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
        },
      },
    },
    'store.spec.yaml',
    __dirname
  );

  const config: Config = new AppConfig(storageConfig);
  const store: IStorageHandler = new Storage(config);
  await store.init(config, []);

  return store;
};

const generateSameUplinkStorage = async function () {
  const storagePath = generateRamdonStorage();
  console.log('-->storagePath', storagePath);
  const storageConfig = configExample(
    {
      config_path: storagePath,
      storage: storagePath,
      packages: {
        jquery: {
          access: ['$all'],
          publish: ['$all'],
          proxy: ['cached'],
        },
        '@jquery/*': {
          access: ['$all'],
          publish: ['$all'],
          proxy: ['notcached'],
        },
      },
      uplinks: {
        cached: {
          url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
          cache: true,
        },
        notcached: {
          url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
          cache: false,
        },
      },
    },
    'store.spec.yaml',
    __dirname
  );

  const config: Config = new AppConfig(storageConfig);
  const store: IStorageHandler = new Storage(config);
  await store.init(config, []);

  return store;
};

const createNullStream = () =>
  new Writable({
    write: function (chunk, encoding, next) {
      next();
    },
  });

describe('StorageTest', () => {
  let mockRegistry;

  beforeAll(async (done) => {
    const binPath = require.resolve('verdaccio/bin/verdaccio');
    const storePath = path.join(__dirname, '/mock/store');
    mockRegistry = await mockServer(mockServerPort, { storePath, silence: true }).init(binPath);
    done();
  });

  afterAll(function (done) {
    const [registry, pid] = mockRegistry;
    registry.stop();
    logger.info(`registry ${pid} has been stopped`);

    done();
  });

  test('should be defined', async () => {
    const storage: IStorageHandler = await generateStorage();

    expect(storage).toBeDefined();
  });

  describe('test getTarball', () => {
    test.skip(
      'should select right uplink given package.proxy for' + ' upstream tarballs',
      async (done) => {
        const storage: IStorageHandler = await generateSameUplinkStorage();
        const notcachedSpy = jest.spyOn(storage.uplinks.notcached, 'fetchTarball');
        const cachedSpy = jest.spyOn(storage.uplinks.cached, 'fetchTarball');

        await new Promise((res, rej) => {
          const reader = storage.getTarball('jquery', 'jquery-1.5.1.tgz');
          reader.on('end', () => {
            expect(notcachedSpy).toHaveBeenCalledTimes(0);
            expect(cachedSpy).toHaveBeenCalledTimes(1);
            expect(cachedSpy).toHaveBeenCalledWith(
              'http://0.0.0.0:55548/jquery/-/jquery-1.5.1.tgz'
            );
            res();
          });
          reader.on('error', (err) => {
            rej(err);
          });
          reader.pipe(createNullStream());
        });

        // Reset counters.
        cachedSpy.mockClear();
        notcachedSpy.mockClear();

        await new Promise((res, rej) => {
          const reader = storage.getTarball('@jquery/jquery', 'jquery-1.5.1.tgz');
          reader.on('end', () => {
            expect(cachedSpy).toHaveBeenCalledTimes(0);
            expect(notcachedSpy).toHaveBeenCalledTimes(1);
            expect(notcachedSpy).toHaveBeenCalledWith(
              'http://0.0.0.0:55548/@jquery%2fjquery/-/jquery-1.5.1.tgz'
            );
            res();
          });
          reader.on('error', (err) => {
            rej(err);
          });
          reader.pipe(createNullStream());
        });

        done();
      }
    );
  });

  describe('test _syncUplinksMetadata', () => {
    test('should fetch from uplink jquery metadata from registry', async (done) => {
      const storage: IStorageHandler = await generateStorage();

      // @ts-ignore
      storage._syncUplinksMetadata('jquery', null, {}, (err, metadata) => {
        expect(err).toBeNull();
        expect(metadata).toBeDefined();
        expect(metadata).toBeInstanceOf(Object);
        done();
      });
    });

    test('should fails on fetch from uplink non existing from registry', async (done) => {
      const storage: IStorageHandler = await generateStorage();

      // @ts-ignore
      storage._syncUplinksMetadata('@verdaccio/404', null, {}, (err, metadata, errors) => {
        expect(err).not.toBeNull();
        expect(errors).toBeInstanceOf(Array);
        expect(errors[0][0].statusCode).toBe(HTTP_STATUS.NOT_FOUND);
        expect(errors[0][0].message).toMatch(API_ERROR.NOT_PACKAGE_UPLINK);
        done();
      });
    });

    test('should fails on fetch from uplink corrupted pkg from registry', async (done) => {
      const storage: IStorageHandler = await generateStorage();

      // @ts-ignore
      storage._syncUplinksMetadata('corrupted-package', null, {}, (err, metadata, errors) => {
        expect(err).not.toBeNull();
        expect(errors).toBeInstanceOf(Array);
        expect(errors[0][0].statusCode).toBe(HTTP_STATUS.INTERNAL_ERROR);
        expect(errors[0][0].message).toMatch(API_ERROR.BAD_STATUS_CODE);
        done();
      });
    });

    test.skip('should not touch if the package exists and has no uplinks', async (done) => {
      const storagePath = generateRamdonStorage();
      const storage: IStorageHandler = (await generateStorage()) as IStorageHandler;
      const metadataSource = path.join(__dirname, '../../partials/metadata');
      const metadataPath = path.join(storagePath, 'npm_test/package.json');

      fs.mkdirSync(path.join(storagePath, 'npm_test'));
      fs.writeFileSync(metadataPath, fs.readFileSync(metadataSource));
      const metadata = JSON.parse(fs.readFileSync(metadataPath).toString());
      // @ts-ignore
      storage.localStorage.updateVersions = jest.fn(storage.localStorage.updateVersions);
      expect(metadata).toBeDefined();
      storage._syncUplinksMetadata('npm_test', metadata, {}, (err) => {
        expect(err).toBeNull();
        // @ts-ignore
        expect(storage.localStorage.updateVersions).not.toHaveBeenCalled();
        done();
      });
    });
  });
});
