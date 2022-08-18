import { pseudoRandomBytes } from 'crypto';
import fs from 'fs';
import MockDate from 'mockdate';
import nock from 'nock';
import * as httpMocks from 'node-mocks-http';
import os from 'os';
import path from 'path';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { API_ERROR, DIST_TAGS, HEADERS, HEADER_TYPE, errorUtils, fileUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import {
  addNewVersion,
  generatePackageMetadata,
  generateRemotePackageMetadata,
} from '@verdaccio/test-helper';
import { Manifest, Version } from '@verdaccio/types';

import { Storage } from '../src';
import manifestFooRemoteNpmjs from './fixtures/manifests/foo-npmjs.json';
import { configExample } from './helpers';

function generateRamdonStorage() {
  const tempStorage = pseudoRandomBytes(5).toString('hex');
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), '/verdaccio-test'));

  return path.join(tempRoot, tempStorage);
}

setup({ type: 'stdout', format: 'pretty', level: 'trace' });

const domain = 'http://localhost:4873';
const fakeHost = 'localhost:4873';
const fooManifest = generatePackageMetadata('foo', '1.0.0');

describe('storage', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.abortPendingRequests();
    jest.clearAllMocks();
  });

  // describe('add packages', () => {
  //   test('add package item', async () => {
  //     nock(domain).get('/foo').reply(404);
  //     const config = new Config(
  //       configExample({
  //         storage: generateRamdonStorage(),
  //       })
  //     );
  //     const storage = new Storage(config);
  //     await storage.init(config);

  //     await storage.addPackage('foo', fooManifest, (err) => {
  //       expect(err).toBeNull();
  //     });
  //   });
  // });

  describe('updateManifest', () => {
    test('create private package', async () => {
      const mockDate = '2018-01-14T11:17:40.712Z';
      MockDate.set(mockDate);
      const pkgName = 'upstream';
      const requestOptions = {
        host: 'localhost',
        protocol: 'http',
        headers: {},
      };
      const config = new Config(
        configExample(
          {
            ...getDefaultConfig(),
            storage: generateRamdonStorage(),
          },
          './fixtures/config/updateManifest-1.yaml',
          __dirname
        )
      );
      const storage = new Storage(config);
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
      expect(manifest.readme).toEqual('# test');
      expect(manifest._attachments).toEqual({});
      expect(typeof manifest._rev).toBeTruthy();
    });

    // TODO: Review triggerUncaughtException exception on abort
    test.skip('abort creating a private package', async () => {
      const mockDate = '2018-01-14T11:17:40.712Z';
      MockDate.set(mockDate);
      const pkgName = 'upstream';
      const config = new Config(
        configExample(
          {
            storage: generateRamdonStorage(),
          },
          './fixtures/config/updateManifest-1.yaml',
          __dirname
        )
      );
      const storage = new Storage(config);
      await storage.init(config);
      const ac = new AbortController();
      setTimeout(() => {
        ac.abort();
      }, 10);
      const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
      await expect(
        storage.updateManifest(bodyNewManifest, {
          signal: ac.signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: {
            host: 'localhost',
            protocol: 'http',
            headers: {},
          },
        })
      ).rejects.toThrow('should throw here');
    });

    test('create private package with multiple consecutive versions', async () => {
      const mockDate = '2018-01-14T11:17:40.712Z';
      MockDate.set(mockDate);
      const settings = {
        uplinksLook: true,
        revision: '1',
        requestOptions: {
          host: 'localhost',
          protocol: 'http',
          headers: {},
        },
      };
      const pkgName = 'upstream';
      // const storage = generateRamdonStorage();
      const config = new Config(
        configExample(
          {
            storage: await fileUtils.createTempStorageFolder('storage-test'),
          },
          './fixtures/config/updateManifest-1.yaml',
          __dirname
        )
      );
      const storage = new Storage(config);
      await storage.init(config);
      // create a package
      const bodyNewManifest1 = generatePackageMetadata(pkgName, '1.0.0');
      await storage.updateManifest(bodyNewManifest1, {
        signal: new AbortController().signal,
        name: pkgName,
        ...settings,
      });
      // publish second version
      const bodyNewManifest2 = generatePackageMetadata(pkgName, '1.0.1');
      await storage.updateManifest(bodyNewManifest2, {
        signal: new AbortController().signal,
        name: pkgName,
        ...settings,
      });
      // retrieve package metadata
      const manifest = (await storage.getPackageByOptions({
        name: pkgName,
        uplinksLook: true,
        requestOptions: {
          host: 'localhost',
          protocol: 'http',
          headers: {},
        },
      })) as Manifest;
      expect(manifest.name).toEqual(pkgName);
      expect(manifest._id).toEqual(pkgName);
      expect(Object.keys(manifest.versions)).toEqual(['1.0.0', '1.0.1']);
      expect(manifest.time).toEqual({
        '1.0.0': mockDate,
        '1.0.1': mockDate,
        created: mockDate,
        modified: mockDate,
      });
      expect(manifest[DIST_TAGS]).toEqual({ latest: '1.0.1' });
      expect(manifest.readme).toEqual('# test');
      expect(manifest._attachments).toEqual({});
      expect(typeof manifest._rev).toBeTruthy();
      // verify the version structure is correct
      const manifestVersion = (await storage.getPackageByOptions({
        name: pkgName,
        version: '1.0.1',
        uplinksLook: true,
        requestOptions: {
          host: 'localhost',
          protocol: 'http',
          headers: {},
        },
      })) as Version;
      expect(manifestVersion.name).toEqual(pkgName);
      expect(manifestVersion.version).toEqual('1.0.1');
      expect(manifestVersion._id).toEqual(`${pkgName}@1.0.1`);
      expect(manifestVersion.description).toEqual('package generated');
      expect(manifestVersion.dist).toEqual({
        integrity:
          'sha512-6gHiERpiDgtb3hjqpQH5/i7zRmvYi9pmCjQf2ZMy3QEa9wVk9RgdZaPWUt7ZOnWUPFjcr9cmE6dUBf+XoPoH4g==',
        shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
        tarball: 'http://localhost:5555/upstream/-/upstream-1.0.1.tgz',
      });

      expect(manifestVersion.contributors).toEqual([]);
      expect(manifestVersion.main).toEqual('index.js');
      expect(manifestVersion.author).toEqual({ name: 'User NPM', email: 'user@domain.com' });
      expect(manifestVersion.dependencies).toEqual({ verdaccio: '^2.7.2' });
    });

    test('fails if version already exist', async () => {
      const settings = {
        uplinksLook: true,
        revision: '1',
        requestOptions: {
          host: 'localhost',
          protocol: 'http',
          headers: {},
        },
      };
      const pkgName = 'upstream';
      const config = new Config(
        configExample(
          {
            storage: generateRamdonStorage(),
          },
          './fixtures/config/getTarballNext-getupstream.yaml',
          __dirname
        )
      );
      const storage = new Storage(config);
      await storage.init(config);
      const bodyNewManifest1 = generatePackageMetadata(pkgName, '1.0.0');
      const bodyNewManifest2 = generatePackageMetadata(pkgName, '1.0.0');
      await storage.updateManifest(bodyNewManifest1, {
        signal: new AbortController().signal,
        name: pkgName,
        ...settings,
      });
      await expect(
        storage.updateManifest(bodyNewManifest2, {
          signal: new AbortController().signal,
          name: pkgName,
          ...settings,
        })
      ).rejects.toThrow(API_ERROR.PACKAGE_EXIST);
    });
  });

  describe('getTarballNext', () => {
    test('should not found a package anywhere', (done) => {
      const config = new Config(
        configExample({
          ...getDefaultConfig(),
          storage: generateRamdonStorage(),
        })
      );
      const storage = new Storage(config);
      storage.init(config).then(() => {
        const abort = new AbortController();
        storage
          .getTarballNext('some-tarball', 'some-tarball-1.0.0.tgz', {
            signal: abort.signal,
          })
          .then((stream) => {
            stream.on('error', (err) => {
              expect(err).toEqual(errorUtils.getNotFound(API_ERROR.NO_PACKAGE));
              done();
            });
          });
      });
    });

    test('should create a package if tarball is requested and does not exist locally', (done) => {
      const pkgName = 'upstream';
      const upstreamManifest = generateRemotePackageMetadata(
        pkgName,
        '1.0.0',
        'https://registry.something.org'
      );
      nock('https://registry.verdaccio.org').get(`/${pkgName}`).reply(201, upstreamManifest);
      nock('https://registry.something.org')
        .get(`/${pkgName}/-/${pkgName}-1.0.0.tgz`)
        // types does not match here with documentation
        // @ts-expect-error
        .replyWithFile(201, path.join(__dirname, 'fixtures/tarball.tgz'), {
          [HEADER_TYPE.CONTENT_LENGTH]: 277,
        });
      const config = new Config(
        configExample(
          {
            storage: generateRamdonStorage(),
          },
          './fixtures/config/getTarballNext-getupstream.yaml',
          __dirname
        )
      );
      const storage = new Storage(config);
      storage.init(config).then(() => {
        const abort = new AbortController();
        storage
          .getTarballNext(pkgName, `${pkgName}-1.0.0.tgz`, {
            signal: abort.signal,
          })
          .then((stream) => {
            stream.on('data', (dat) => {
              expect(dat).toBeDefined();
            });
            stream.on('end', () => {
              done();
            });
            stream.on('error', () => {
              done('this should not happen');
            });
          });
      });
    });

    test('should serve fetch tarball from upstream without dist info local', (done) => {
      const pkgName = 'upstream';
      const upstreamManifest = addNewVersion(
        generateRemotePackageMetadata(pkgName, '1.0.0'),
        '1.0.1'
      );
      nock('https://registry.verdaccio.org').get(`/${pkgName}`).reply(201, upstreamManifest);
      nock('http://localhost:5555')
        .get(`/${pkgName}/-/${pkgName}-1.0.1.tgz`)
        // types does not match here with documentation
        // @ts-expect-error
        .replyWithFile(201, path.join(__dirname, 'fixtures/tarball.tgz'), {
          [HEADER_TYPE.CONTENT_LENGTH]: 277,
        });
      const config = new Config(
        configExample(
          {
            storage: generateRamdonStorage(),
          },
          './fixtures/config/getTarballNext-getupstream.yaml',
          __dirname
        )
      );
      const storage = new Storage(config);
      storage.init(config).then(() => {
        const ac = new AbortController();
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        storage
          .updateManifest(bodyNewManifest, {
            signal: ac.signal,
            name: pkgName,
            uplinksLook: true,
            revision: '1',
            requestOptions: {
              host: 'localhost',
              protocol: 'http',
              headers: {},
            },
          })
          .then(() => {
            const abort = new AbortController();
            storage
              .getTarballNext(pkgName, `${pkgName}-1.0.1.tgz`, {
                signal: abort.signal,
              })
              .then((stream) => {
                stream.on('data', (dat) => {
                  expect(dat).toBeDefined();
                });
                stream.on('end', () => {
                  done();
                });
                stream.on('error', () => {
                  done('this should not happen');
                });
              });
          });
      });
    });

    test('should serve fetch tarball from upstream without with info local', (done) => {
      const pkgName = 'upstream';
      const upstreamManifest = addNewVersion(
        addNewVersion(generateRemotePackageMetadata(pkgName, '1.0.0'), '1.0.1'),
        '1.0.2'
      );
      nock('https://registry.verdaccio.org')
        .get(`/${pkgName}`)
        .times(10)
        .reply(201, upstreamManifest);
      nock('http://localhost:5555')
        .get(`/${pkgName}/-/${pkgName}-1.0.0.tgz`)
        // types does not match here with documentation
        // @ts-expect-error
        .replyWithFile(201, path.join(__dirname, 'fixtures/tarball.tgz'), {
          [HEADER_TYPE.CONTENT_LENGTH]: 277,
        });
      const storagePath = generateRamdonStorage();
      const config = new Config(
        configExample(
          {
            storage: storagePath,
          },
          './fixtures/config/getTarballNext-getupstream.yaml',
          __dirname
        )
      );
      const storage = new Storage(config);
      storage.init(config).then(() => {
        const req = httpMocks.createRequest({
          method: 'GET',
          connection: { remoteAddress: fakeHost },
          headers: {
            host: fakeHost,
            [HEADERS.FORWARDED_PROTO]: 'http',
          },
          url: '/',
        });
        return storage
          .getPackageByOptions({
            name: pkgName,
            uplinksLook: true,
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host') as string,
            },
          })
          .then(() => {
            const abort = new AbortController();
            storage
              .getTarballNext(pkgName, `${pkgName}-1.0.0.tgz`, {
                signal: abort.signal,
              })
              .then((stream) => {
                stream.on('data', (dat) => {
                  expect(dat).toBeDefined();
                });
                stream.on('end', () => {
                  done();
                });
                stream.once('error', () => {
                  done('this should not happen');
                });
              });
          });
      });
    });

    test('should serve local cache', (done) => {
      const pkgName = 'upstream';
      const config = new Config(
        configExample(
          {
            storage: generateRamdonStorage(),
          },
          './fixtures/config/getTarballNext-getupstream.yaml',
          __dirname
        )
      );
      const storage = new Storage(config);
      storage.init(config).then(() => {
        const ac = new AbortController();
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        storage
          .updateManifest(bodyNewManifest, {
            signal: ac.signal,
            name: pkgName,
            uplinksLook: true,
            revision: '1',
            requestOptions: {
              host: 'localhost',
              protocol: 'http',
              headers: {},
            },
          })
          .then(() => {
            const abort = new AbortController();
            storage
              .getTarballNext(pkgName, `${pkgName}-1.0.0.tgz`, {
                signal: abort.signal,
              })
              .then((stream) => {
                stream.on('data', (dat) => {
                  expect(dat).toBeDefined();
                });
                stream.on('end', () => {
                  done();
                });
                stream.on('error', () => {
                  done('this should not happen');
                });
              });
          });
      });
    });
  });

  describe('syncUplinksMetadataNext()', () => {
    describe('error handling', () => {
      test('should handle double failure on uplinks with timeout', async () => {
        const fooManifest = generatePackageMetadata('timeout', '8.0.0');

        nock('https://registry.domain.com')
          .get('/timeout')
          .times(10)
          .delayConnection(2000)
          .reply(201, manifestFooRemoteNpmjs);

        const config = new Config(
          configExample(
            {
              storage: generateRamdonStorage(),
            },
            './fixtures/config/syncDoubleUplinksMetadata.yaml',
            __dirname
          )
        );

        const storage = new Storage(config);
        await storage.init(config);
        await expect(
          storage.syncUplinksMetadataNext(fooManifest.name, null, {
            retry: { limit: 0 },
            timeout: {
              lookup: 100,
              connect: 50,
              secureConnect: 50,
              socket: 500,
              // send: 10000,
              response: 1000,
            },
          })
        ).rejects.toThrow('ETIMEDOUT');
      }, 10000);

      test('should handle one proxy fails', async () => {
        const fooManifest = generatePackageMetadata('foo', '8.0.0');
        nock('https://registry.verdaccio.org').get('/foo').replyWithError('service in holidays');
        const config = new Config(
          configExample(
            {
              storage: generateRamdonStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config);
        await storage.init(config);
        await expect(
          storage.syncUplinksMetadataNext(fooManifest.name, null, {
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
              storage: generateRamdonStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config);
        await storage.init(config);
        const [manifest] = await storage.syncUplinksMetadataNext(fooManifest.name, fooManifest, {
          retry: 0,
        });
        expect(manifest).toBe(fooManifest);
      });
    });

    describe('success scenarios', () => {
      test('should handle one proxy success', async () => {
        const fooManifest = generatePackageMetadata('foo', '8.0.0');
        nock('https://registry.verdaccio.org').get('/foo').reply(201, manifestFooRemoteNpmjs);
        const config = new Config(
          configExample(
            {
              storage: generateRamdonStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config);
        await storage.init(config);

        const [response] = await storage.syncUplinksMetadataNext(fooManifest.name, fooManifest);
        expect(response).not.toBeNull();
        expect((response as Manifest).name).toEqual(fooManifest.name);
        expect((response as Manifest)[DIST_TAGS].latest).toEqual('8.0.0');
      });

      test('should handle one proxy success with no local cache manifest', async () => {
        nock('https://registry.verdaccio.org').get('/foo').reply(201, manifestFooRemoteNpmjs);
        const config = new Config(
          configExample(
            {
              storage: generateRamdonStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config);
        await storage.init(config);

        const [response] = await storage.syncUplinksMetadataNext(fooManifest.name, null);
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
              storage: generateRamdonStorage(),
            },
            './fixtures/config/syncNoUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config);
        await storage.init(config);

        const [response] = await storage.syncUplinksMetadataNext(fooManifest.name, fooManifest);
        expect(response).not.toBeNull();
        expect((response as Manifest).name).toEqual(fooManifest.name);
        expect((response as Manifest)[DIST_TAGS].latest).toEqual('8.0.0');
      });
      test.todo('should handle double proxy with last one success');
    });
    describe('options', () => {
      test('should handle disable uplinks via options.uplinksLook=false', async () => {
        const fooManifest = generatePackageMetadata('foo', '8.0.0');
        nock('https://registry.verdaccio.org').get('/foo').reply(201, manifestFooRemoteNpmjs);
        const config = new Config(
          configExample(
            {
              storage: generateRamdonStorage(),
            },
            './fixtures/config/syncSingleUplinksMetadata.yaml',
            __dirname
          )
        );
        const storage = new Storage(config);
        await storage.init(config);

        const [response] = await storage.syncUplinksMetadataNext(fooManifest.name, fooManifest, {
          uplinksLook: false,
        });

        expect((response as Manifest).name).toEqual(fooManifest.name);
        expect((response as Manifest)[DIST_TAGS].latest).toEqual('8.0.0');
      });
    });
  });

  // TODO: getPackageNext should replace getPackage eventually
  describe('get packages getPackageByOptions()', () => {
    describe('with uplinks', () => {
      test('should get 201 and merge from uplink', async () => {
        nock(domain).get('/foo').reply(201, fooManifest);
        const config = new Config(
          configExample({
            ...getDefaultConfig(),
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
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host') as string,
            },
          })
        ).resolves.toEqual(expect.objectContaining({ name: 'foo' }));
      });

      test('should get 201 and merge from uplink with version', async () => {
        nock(domain).get('/foo').reply(201, fooManifest);
        const config = new Config(
          configExample({
            ...getDefaultConfig(),
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
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host') as string,
            },
          })
        ).resolves.toEqual(expect.objectContaining({ name: 'foo' }));
      });

      test('should get 201 and merge from uplink with dist-tag', async () => {
        nock(domain).get('/foo').reply(201, fooManifest);
        const config = new Config(
          configExample({
            ...getDefaultConfig(),
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
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host') as string,
            },
          })
        ).resolves.toEqual(expect.objectContaining({ name: 'foo' }));
      });

      test('should get 404 for version does not exist', async () => {
        nock(domain).get('/foo').reply(201, fooManifest);
        const config = new Config(
          configExample({
            ...getDefaultConfig(),
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
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host') as string,
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
            ...getDefaultConfig(),
            uplinks: {
              npmjs: {
                url: domain,
              },
            },
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
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host') as string,
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
            ...getDefaultConfig(),
            uplinks: {
              npmjs: {
                url: domain,
              },
            },
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
            retry: { limit: 0 },
            requestOptions: {
              headers: req.headers as any,
              protocol: req.protocol,
              host: req.get('host') as string,
            },
          })
        ).rejects.toThrow(errorUtils.getServiceUnavailable('ETIMEDOUT'));
      });
    });
  });
});
