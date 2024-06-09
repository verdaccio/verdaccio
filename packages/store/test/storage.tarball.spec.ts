import nock from 'nock';
import * as httpMocks from 'node-mocks-http';
import path from 'path';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { API_ERROR, HEADERS, HEADER_TYPE, errorUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import {
  addNewVersion,
  generatePackageMetadata,
  generateRemotePackageMetadata,
} from '@verdaccio/test-helper';
import { Manifest } from '@verdaccio/types';

import { Storage } from '../src';
import { configExample, defaultRequestOptions, generateRandomStorage } from './helpers';

setup({ type: 'stdout', format: 'pretty', level: 'trace' });

const fakeHost = 'localhost:4873';

describe('storage', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.abortPendingRequests();
    jest.clearAllMocks();
  });

  describe('getTarball', () => {
    test('should get a package from local storage', (done) => {
      const pkgName = 'foo';
      const config = new Config(
        configExample({
          ...getDefaultConfig(),
          storage: generateRandomStorage(),
        })
      );
      const storage = new Storage(config);
      storage.init(config).then(() => {
        const ac = new AbortController();
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        storage
          .updateManifest(bodyNewManifest, {
            signal: ac.signal,
            name: pkgName,
            uplinksLook: false,
            requestOptions: defaultRequestOptions,
          })
          .then(() => {
            const abort = new AbortController();
            storage
              .getTarball(pkgName, `${pkgName}-1.0.0.tgz`, {
                signal: abort.signal,
              })
              .then((stream) => {
                stream.on('data', (dat) => {
                  expect(dat).toBeDefined();
                  expect(dat.length).toEqual(512);
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

    test('should not found a package anywhere', (done) => {
      const config = new Config(
        configExample({
          ...getDefaultConfig(),
          storage: generateRandomStorage(),
        })
      );
      const storage = new Storage(config);
      storage.init(config).then(() => {
        const abort = new AbortController();
        storage
          .getTarball('some-tarball', 'some-tarball-1.0.0.tgz', {
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
            storage: generateRandomStorage(),
          },
          './fixtures/config/getTarball-getupstream.yaml',
          __dirname
        )
      );
      const storage = new Storage(config);
      storage.init(config).then(() => {
        const abort = new AbortController();
        storage
          .getTarball(pkgName, `${pkgName}-1.0.0.tgz`, {
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
        generateRemotePackageMetadata(pkgName, '1.0.0') as Manifest,
        '1.0.1'
      );
      nock('https://registry.verdaccio.org').get(`/${pkgName}`).reply(201, upstreamManifest);
      nock('http://localhost:5555')
        .get(`/${pkgName}/-/${pkgName}-1.0.1.tgz`)
        // types does not match here with documentation
        .replyWithFile(201, path.join(__dirname, 'fixtures/tarball.tgz'), {
          [HEADER_TYPE.CONTENT_LENGTH]: 277,
        });
      const config = new Config(
        configExample(
          {
            storage: generateRandomStorage(),
          },
          './fixtures/config/getTarball-getupstream.yaml',
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
              .getTarball(pkgName, `${pkgName}-1.0.1.tgz`, {
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
        addNewVersion(generateRemotePackageMetadata(pkgName, '1.0.0') as Manifest, '1.0.1'),
        '1.0.2'
      );
      nock('https://registry.verdaccio.org')
        .get(`/${pkgName}`)
        .times(10)
        .reply(201, upstreamManifest);
      nock('http://localhost:5555')
        .get(`/${pkgName}/-/${pkgName}-1.0.0.tgz`)
        // types does not match here with documentation
        .replyWithFile(201, path.join(__dirname, 'fixtures/tarball.tgz'), {
          [HEADER_TYPE.CONTENT_LENGTH]: 277,
        });
      const storagePath = generateRandomStorage();
      const config = new Config(
        configExample(
          {
            storage: storagePath,
          },
          './fixtures/config/getTarball-getupstream.yaml',
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
              .getTarball(pkgName, `${pkgName}-1.0.0.tgz`, {
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
            storage: generateRandomStorage(),
          },
          './fixtures/config/getTarball-getupstream.yaml',
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
              .getTarball(pkgName, `${pkgName}-1.0.0.tgz`, {
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

  describe('removeTarball', () => {
    test('should fail on remove tarball of package does not exist', async () => {
      const username = 'foouser';
      const config = new Config(
        configExample({
          ...getDefaultConfig(),
          storage: generateRandomStorage(),
        })
      );
      const storage = new Storage(config);
      await storage.init(config);
      await expect(storage.removeTarball('foo', 'foo-1.0.0.tgz', 'rev', username)).rejects.toThrow(
        API_ERROR.NO_PACKAGE
      );
    });
  });
});
