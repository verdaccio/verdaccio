import nock from 'nock';
import * as httpMocks from 'node-mocks-http';

import { Config } from '@verdaccio/config';
import { HEADERS, errorUtils } from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/helper';
import { setup } from '@verdaccio/logger';
import { configExample, generateRamdonStorage } from '@verdaccio/mock';

import { Storage } from '../src';

setup([]);

const domain = 'http://localhost:4873';
const fakeHost = 'localhost:4873';
const fooManifest = generatePackageMetadata('foo', '1.0.0');

describe('storage', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.abortPendingRequests();
    jest.clearAllMocks();
  });
  describe('add packages', () => {
    test('add package item', async () => {
      nock(domain).get('/foo').reply(404);
      const config = new Config(
        configExample({
          storage: generateRamdonStorage(),
        })
      );
      const storage = new Storage(config);
      await storage.init(config);

      await storage.addPackage('foo', fooManifest, (err) => {
        expect(err).toBeNull();
      });
    });
  });

  // TODO: getPackageNext should replace getPackage eventually
  describe('get packages getPackageNext()', () => {
    describe('with uplinks', () => {
      test('should get 201 and merge from uplink', async () => {
        nock(domain).get('/foo').reply(201, fooManifest);
        const config = new Config(
          configExample({
            storage: generateRamdonStorage(),
          })
        );
        const req = httpMocks.createRequest({
          method: 'GET',
          connection: { remoteAddress: fakeHost },
          headers: {
            host: fakeHost,
            [HEADERS.FORWARDED_PROTO]: 'http',
          },
          url: '/',
        });
        const storage = new Storage(config);
        await storage.init(config);
        await expect(
          storage.getPackageByOptions({
            name: 'foo',
            uplinksLook: true,
            req,
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host'),
            },
          })
        ).resolves.toEqual(expect.objectContaining({ name: 'foo' }));
      });

      test('should get 201 and merge from uplink with version', async () => {
        nock(domain).get('/foo').reply(201, fooManifest);
        const config = new Config(
          configExample({
            storage: generateRamdonStorage(),
          })
        );
        const req = httpMocks.createRequest({
          method: 'GET',
          connection: { remoteAddress: fakeHost },
          headers: {
            host: fakeHost,
            [HEADERS.FORWARDED_PROTO]: 'http',
          },
          url: '/',
        });
        const storage = new Storage(config);
        await storage.init(config);
        await expect(
          storage.getPackageByOptions({
            name: 'foo',
            version: '1.0.0',
            uplinksLook: true,
            req,
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host'),
            },
          })
        ).resolves.toEqual(expect.objectContaining({ name: 'foo' }));
      });

      test('should get 201 and merge from uplink with dist-tag', async () => {
        nock(domain).get('/foo').reply(201, fooManifest);
        const config = new Config(
          configExample({
            storage: generateRamdonStorage(),
          })
        );
        const req = httpMocks.createRequest({
          method: 'GET',
          connection: { remoteAddress: fakeHost },
          headers: {
            host: fakeHost,
            [HEADERS.FORWARDED_PROTO]: 'http',
          },
          url: '/',
        });
        const storage = new Storage(config);
        await storage.init(config);
        await expect(
          storage.getPackageByOptions({
            name: 'foo',
            version: 'latest',
            uplinksLook: true,
            req,
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host'),
            },
          })
        ).resolves.toEqual(expect.objectContaining({ name: 'foo' }));
      });

      test('should get 404 for version does not exist', async () => {
        nock(domain).get('/foo').reply(201, fooManifest);
        const config = new Config(
          configExample({
            storage: generateRamdonStorage(),
          })
        );
        const req = httpMocks.createRequest({
          method: 'GET',
          connection: { remoteAddress: fakeHost },
          headers: {
            host: fakeHost,
            [HEADERS.FORWARDED_PROTO]: 'http',
          },
          url: '/',
        });
        const storage = new Storage(config);
        await storage.init(config);
        await expect(
          storage.getPackageByOptions({
            name: 'foo',
            version: '1.0.0-does-not-exist',
            uplinksLook: true,
            req,
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host'),
            },
          })
        ).rejects.toThrow(
          errorUtils.getNotFound("this version doesn't exist: 1.0.0-does-not-exist")
        );
      });

      test('should get 404', async () => {
        nock(domain).get('/foo2').reply(404);
        const config = new Config(
          configExample({
            storage: generateRamdonStorage(),
          })
        );
        const req = httpMocks.createRequest({
          method: 'GET',
          connection: { remoteAddress: fakeHost },
          headers: {
            host: fakeHost,
            [HEADERS.FORWARDED_PROTO]: 'http',
          },
          url: '/',
        });
        const storage = new Storage(config);
        await storage.init(config);
        await expect(
          storage.getPackageByOptions({
            name: 'foo2',
            uplinksLook: true,
            req,
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host'),
            },
          })
        ).rejects.toThrow(errorUtils.getNotFound());
      });

      test('should get ETIMEDOUT with uplink', async () => {
        nock(domain).get('/foo2').replyWithError({
          code: 'ETIMEDOUT',
          errno: 'ETIMEDOUT',
        });
        const config = new Config(
          configExample({
            storage: generateRamdonStorage(),
          })
        );
        const req = httpMocks.createRequest({
          method: 'GET',
          connection: { remoteAddress: fakeHost },
          headers: {
            host: fakeHost,
            [HEADERS.FORWARDED_PROTO]: 'http',
          },
          url: '/',
        });
        const storage = new Storage(config);
        await storage.init(config);
        await expect(
          storage.getPackageByOptions({
            name: 'foo2',
            uplinksLook: true,
            req,
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host'),
            },
          })
        ).rejects.toThrow(errorUtils.getServiceUnavailable());
      });
    });
  });
});
