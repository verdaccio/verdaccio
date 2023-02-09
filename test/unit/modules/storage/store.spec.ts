import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import { Writable } from 'stream';

import { Config } from '@verdaccio/types';

import AppConfig from '../../../../src/lib/config';
import { API_ERROR, HTTP_STATUS } from '../../../../src/lib/constants';
import { setup } from '../../../../src/lib/logger';
import Storage from '../../../../src/lib/storage';
import { DOMAIN_SERVERS } from '../../../functional/config.functional';
import { mockServer } from '../../__helper/mock';
import configExample from '../../partials/config';

setup({});

jest.setTimeout(20000);

const storagePath = path.join(__dirname, '../../partials/store/test-storage-store.spec');
const mockServerPort = 55548;
const generateStorage = async function (port = mockServerPort) {
  const storageConfig = configExample(
    {
      self_path: __dirname,
      storage: storagePath,
      uplinks: {
        npmjs: {
          url: `http://${DOMAIN_SERVERS}:${port}`,
        },
      },
    },
    'store.spec.yaml'
  );

  const config: Config = new AppConfig(storageConfig);
  const store: any = new Storage(config);
  await store.init(config, []);

  return store;
};

const generateSameUplinkStorage = async function (port = mockServerPort) {
  const storageConfig = configExample(
    {
      self_path: __dirname,
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
          url: `http://${DOMAIN_SERVERS}:${port}`,
          cache: true,
        },
        notcached: {
          url: `http://${DOMAIN_SERVERS}:${port}`,
          cache: false,
        },
      },
    },
    'store.spec.yaml'
  );

  const config: Config = new AppConfig(storageConfig);
  const store: any = new Storage(config);
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

  beforeAll((done) => {
    rimraf(storagePath, async () => {
      mockRegistry = await mockServer(mockServerPort).init();
      done();
    });
  });

  afterAll(function (done) {
    mockRegistry[0].stop();
    done();
  });

  test('should be defined', async () => {
    const storage: any = await generateStorage();

    expect(storage).toBeDefined();
  });

  describe('test getTarball', () => {
    test('should select right uplink given package.proxy for upstream tarballs', async () => {
      const storage: any = await generateSameUplinkStorage();
      const notcachedSpy = jest.spyOn(storage.uplinks.notcached, 'fetchTarball');
      const cachedSpy = jest.spyOn(storage.uplinks.cached, 'fetchTarball');

      await new Promise((res, rej) => {
        const reader = storage.getTarball('jquery', 'jquery-1.5.1.tgz');
        reader.on('end', () => {
          expect(notcachedSpy).toHaveBeenCalledTimes(0);
          expect(cachedSpy).toHaveBeenCalledTimes(1);
          expect(cachedSpy).toHaveBeenCalledWith(
            'http://localhost:55548/jquery/-/jquery-1.5.1.tgz'
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
            'http://localhost:55548/@jquery/jquery/-/jquery-1.5.1.tgz'
          );
          res();
        });
        reader.on('error', (err) => {
          rej(err);
        });
        reader.pipe(createNullStream());
      });
    });
  });

  describe('test _syncUplinksMetadata', () => {
    test('should fetch from uplink jquery metadata from registry', async () => {
      const storage: any = await generateStorage();

      return new Promise((resolve) => {
        storage._syncUplinksMetadata('jquery', null, {}, (err, metadata) => {
          expect(err).toBeNull();
          expect(metadata).toBeDefined();
          expect(metadata).toBeInstanceOf(Object);
          resolve();
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
          resolve();
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
          resolve();
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
      storage.localStorage.updateVersions = jest.fn(storage.localStorage.updateVersions);
      expect(metadata).toBeDefined();
      return new Promise((resolve) => {
        storage._syncUplinksMetadata('npm_test', metadata, {}, (err) => {
          expect(err).toBeNull();
          // @ts-ignore
          expect(storage.localStorage.updateVersions).not.toHaveBeenCalled();
          resolve();
        });
      });
    });
  });
});
