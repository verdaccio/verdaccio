import MockDate from 'mockdate';
import nock from 'nock';
import * as httpMocks from 'node-mocks-http';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Config, getDefaultConfig } from '@verdaccio/config';
import { API_ERROR, API_MESSAGE, DIST_TAGS, HEADERS, fileUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { generatePackageMetadata, getDeprecatedPackageMetadata } from '@verdaccio/test-helper';
import { Author, Manifest, Version } from '@verdaccio/types';

import { Storage } from '../src';
import {
  configExample,
  defaultRequestOptions,
  executeStarPackage,
  generateRandomStorage,
  getConfig,
} from './helpers';

const logger = setup({ type: 'stdout', format: 'pretty', level: 'trace' });

const fakeHost = 'localhost:4873';

const executeChangeOwners = async (
  storage,
  options: {
    maintainers: Author[];
    username: string;
    name: string;
    _rev: string;
    _id?: string;
  }
) => {
  const { name, _rev, _id, maintainers, username } = options;
  const ownerManifest = {
    _rev,
    _id,
    maintainers,
  };
  return storage.updateManifest(ownerManifest, {
    signal: new AbortController().signal,
    name,
    uplinksLook: true,
    revision: '1',
    requestOptions: { ...defaultRequestOptions, username },
  });
};

describe('storage', () => {
  beforeEach(() => {
    nock.cleanAll();
    nock.abortPendingRequests();
    vi.clearAllMocks();
  });

  describe('updateManifest', () => {
    describe('publishing', () => {
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
              storage: generateRandomStorage(),
            },
            './fixtures/config/updateManifest-1.yaml',
            __dirname
          )
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

      // TODO: Review triggerUncaughtException exception on abort
      test.skip('abort creating a private package', async () => {
        const mockDate = '2018-01-14T11:17:40.712Z';
        MockDate.set(mockDate);
        const pkgName = 'upstream';
        const config = new Config(
          configExample(
            {
              storage: generateRandomStorage(),
            },
            './fixtures/config/updateManifest-1.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
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
        // const storage = generateRandomStorage();
        const config = new Config(
          configExample(
            {
              storage: await fileUtils.createTempStorageFolder('storage-test'),
            },
            './fixtures/config/updateManifest-1.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
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
          fileCount: 4,
          integrity:
            'sha512-6gHiERpiDgtb3hjqpQH5/i7zRmvYi9pmCjQf2ZMy3QEa9wVk9RgdZaPWUt7ZOnWUPFjcr9cmE6dUBf+XoPoH4g==',
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
          tarball: 'http://localhost:5555/upstream/-/upstream-1.0.1.tgz',
          unpackedSize: 543,
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
              storage: generateRandomStorage(),
            },
            './fixtures/config/getTarball-getupstream.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
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

      test('create private package with readme only in manifest', async () => {
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
              storage: generateRandomStorage(),
            },
            './fixtures/config/updateManifest-1.yaml',
            __dirname
          )
        );
        const storage = new Storage(config, logger);
        await storage.init(config);
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');

        // Remove readme from version to simulate behaviour of older package managers like npm6
        bodyNewManifest.versions['1.0.0'].readme = '';

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

        // verdaccio keeps latest version of readme on manifest level but not by version
        expect(manifest.versions['1.0.0'].readme).not.toBeDefined();
        expect(manifest.readme).toEqual('# test');
      });
    });
    describe('deprecate', () => {
      test.each([['foo'], ['@scope/foo']])('deprecate package %s', async (pkgName) => {
        const mockDate = '2018-01-14T11:17:40.712Z';
        MockDate.set(mockDate);
        const config = getConfig('deprecate.yaml');
        const storage = new Storage(config, logger);
        await storage.init(config);
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });
        const manifest1 = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;
        expect(manifest1.versions['1.0.0'].deprecated).toBeUndefined();

        const deprecatedManifest = getDeprecatedPackageMetadata(
          pkgName,
          '1.0.0',
          {
            ['latest']: '1.0.0',
          },
          'some deprecation message',
          manifest1._rev
        );
        await storage.updateManifest(deprecatedManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });
        const manifest = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;
        expect(manifest.name).toEqual(pkgName);
        expect(manifest.versions['1.0.0'].deprecated).toEqual('some deprecation message');
        // important revision is updated
        expect(manifest._rev !== deprecatedManifest._rev).toBeTruthy();
      });
      test.each([['foo'], ['@scope/foo']])('undeprecate package %s', async (pkgName) => {
        const mockDate = '2018-01-14T11:17:40.712Z';
        MockDate.set(mockDate);
        const config = getConfig('deprecate.yaml');
        const storage = new Storage(config, logger);
        await storage.init(config);
        // publish new package
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });

        // verify not deprecated
        const manifest1 = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;
        expect(manifest1.versions['1.0.0'].deprecated).toBeUndefined();

        // deprecate version
        const deprecatedManifest = getDeprecatedPackageMetadata(
          pkgName,
          '1.0.0',
          {
            ['latest']: '1.0.0',
          },
          'some deprecation message',
          manifest1._rev
        );
        await storage.updateManifest(deprecatedManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });
        const manifest = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;
        expect(manifest.name).toEqual(pkgName);
        expect(manifest.versions['1.0.0'].deprecated).toEqual('some deprecation message');
        // important revision is updated
        expect(manifest._rev !== deprecatedManifest._rev).toBeTruthy();

        // un deprecated the previous deprecated
        const undeprecatedManifest = {
          ...manifest,
        };
        undeprecatedManifest.versions['1.0.0'].deprecated = '';
        await storage.updateManifest(undeprecatedManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });

        const manifest3 = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;
        expect(manifest3.name).toEqual(pkgName);
        expect(manifest3.versions['1.0.0'].deprecated).toBeUndefined();
        // important revision is updated
        expect(manifest3._rev !== deprecatedManifest._rev).toBeTruthy();
      });
    });
    describe('star', () => {
      test.each([['foo']])('star package %s', async (pkgName) => {
        const config = getConfig('deprecate.yaml');
        const storage = new Storage(config, logger);
        await storage.init(config);
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });
        const message = await executeStarPackage(storage, {
          _rev: bodyNewManifest._rev,
          _id: bodyNewManifest._id,
          name: pkgName,
          username: 'fooUser',
          users: { fooUser: true },
        });
        expect(message).toEqual(API_MESSAGE.PKG_CHANGED);
        const manifest1 = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;

        expect(manifest1?.users).toEqual({
          fooUser: true,
        });
      });

      test.each([['foo']])('should add multiple users to package %s', async (pkgName) => {
        const mockDate = '2018-01-14T11:17:40.712Z';
        MockDate.set(mockDate);
        const config = getConfig('deprecate.yaml');
        const storage = new Storage(config, logger);
        await storage.init(config);
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });
        const message = await executeStarPackage(storage, {
          _rev: bodyNewManifest._rev,
          _id: bodyNewManifest._id,
          name: pkgName,
          username: 'fooUser',
          users: { fooUser: true },
        });
        expect(message).toEqual(API_MESSAGE.PKG_CHANGED);

        await executeStarPackage(storage, {
          _rev: bodyNewManifest._rev,
          _id: bodyNewManifest._id,
          name: pkgName,
          username: 'owner',
          users: { owner: true },
        });
        const manifest1 = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;

        expect(manifest1?.users).toEqual({
          fooUser: true,
          owner: true,
        });
      });

      test.each([['foo']])('should ignore duplicate users to package %s', async (pkgName) => {
        const mockDate = '2018-01-14T11:17:40.712Z';
        MockDate.set(mockDate);
        const config = getConfig('deprecate.yaml');
        const storage = new Storage(config, logger);
        await storage.init(config);
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });
        const message = await executeStarPackage(storage, {
          _rev: bodyNewManifest._rev,
          _id: bodyNewManifest._id,
          name: pkgName,
          username: 'fooUser',
          users: { fooUser: true },
        });
        expect(message).toEqual(API_MESSAGE.PKG_CHANGED);

        await executeStarPackage(storage, {
          _rev: bodyNewManifest._rev,
          _id: bodyNewManifest._id,
          name: pkgName,
          username: 'fooUser',
          users: { fooUser: true },
        });
        const manifest1 = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;

        expect(manifest1?.users).toEqual({
          fooUser: true,
        });
      });

      test.each([['foo']])('should unstar a package %s', async (pkgName) => {
        const config = getConfig('deprecate.yaml');
        const storage = new Storage(config, logger);
        await storage.init(config);
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });
        const message = await executeStarPackage(storage, {
          _rev: bodyNewManifest._rev,
          _id: bodyNewManifest._id,
          name: pkgName,
          username: 'fooUser',
          users: { fooUser: true },
        });
        expect(message).toEqual(API_MESSAGE.PKG_CHANGED);

        await executeStarPackage(storage, {
          _rev: bodyNewManifest._rev,
          _id: bodyNewManifest._id,
          name: pkgName,
          username: 'fooUser',
          users: {},
        });
        const manifest1 = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;

        expect(manifest1?.users).toEqual({});
      });

      test.each([['foo']])('should handle missing username %s', async (pkgName) => {
        const config = getConfig('deprecate.yaml');
        const storage = new Storage(config, logger);
        await storage.init(config);
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          revision: '1',
          requestOptions: defaultRequestOptions,
        });
        await expect(
          executeStarPackage(storage, {
            _rev: bodyNewManifest._rev,
            _id: bodyNewManifest._id,
            name: pkgName,
            // @ts-expect-error
            username: undefined,
            users: { fooUser: true },
          })
        ).rejects.toThrow();
      });
    });

    describe('owner', () => {
      test.each([
        ['foo', 'publishWithOwnerDefault.yaml'],
        ['foo', 'publishWithOwnerAndCheck.yaml'],
      ])('new package %s, %s (anonymous)', async (pkgName, configFile) => {
        const config = getConfig(configFile);
        const storage = new Storage(config, logger);
        await storage.init(config);
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        });
        const manifest = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;
        expect(manifest?.maintainers).toEqual([{ name: 'Anonymous', email: '' }]);
      });

      test.each([
        ['foo', 'publishWithOwnerDefault.yaml'],
        ['foo', 'publishWithOwnerAndCheck.yaml'],
      ])('new package %s, %s (logged in)', async (pkgName, configFile) => {
        const config = getConfig(configFile);
        const storage = new Storage(config, logger);
        await storage.init(config);
        const owner = { name: 'fooUser', email: '' };
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        const options = { ...defaultRequestOptions, username: owner.name };
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: true,
          requestOptions: options,
        });
        const manifest = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: true,
          requestOptions: defaultRequestOptions,
        })) as Manifest;
        expect(manifest?.maintainers).toEqual([owner]);
        expect(manifest?.versions['1.0.0'].maintainers).toEqual([owner]);
      });

      test.each([
        ['foo', 'publishWithOwnerDefault.yaml'],
        ['foo', 'publishWithOwnerAndCheck.yaml'],
      ])('add/remove owner %s, %s', async (pkgName, configFile) => {
        const config = getConfig(configFile);
        const storage = new Storage(config, logger);
        await storage.init(config);
        const firstOwner = { name: 'fooUser', email: '' };
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        const options = { ...defaultRequestOptions, username: firstOwner.name };
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: false,
          requestOptions: options,
        });

        // add owner
        const secondOwner = { name: 'barUser', email: '' };
        const maintainers = [firstOwner, secondOwner];

        const message = await executeChangeOwners(storage, {
          _rev: bodyNewManifest._rev,
          _id: bodyNewManifest._id,
          name: pkgName,
          username: firstOwner.name,
          maintainers: maintainers,
        });
        expect(message).toEqual(API_MESSAGE.PKG_CHANGED);

        const manifest = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: false,
          requestOptions: options,
        })) as Manifest;
        expect(manifest?.maintainers).toEqual(maintainers);
        // published version should not be affected
        expect(manifest?.versions['1.0.0'].maintainers).toEqual([firstOwner]);

        // remove owner
        const maintainers2 = [secondOwner];
        const message2 = await executeChangeOwners(storage, {
          _rev: bodyNewManifest._rev,
          _id: bodyNewManifest._id,
          name: pkgName,
          username: firstOwner.name,
          maintainers: maintainers2,
        });
        expect(message2).toEqual(API_MESSAGE.PKG_CHANGED);

        const manifest2 = (await storage.getPackageByOptions({
          name: pkgName,
          uplinksLook: false,
          requestOptions: options,
        })) as Manifest;
        expect(manifest2?.maintainers).toEqual(maintainers2);
        // published version should not be affected
        expect(manifest2?.versions['1.0.0'].maintainers).toEqual([firstOwner]);
      });

      test.each([
        ['foo', 'publishWithOwnerDefault.yaml'],
        ['foo', 'publishWithOwnerAndCheck.yaml'],
      ])('should fail removing last owner %s, %s', async (pkgName, configFile) => {
        const config = getConfig(configFile);
        const storage = new Storage(config, logger);
        await storage.init(config);
        const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
        const owner = 'fooUser';
        const options = { ...defaultRequestOptions, username: owner };
        await storage.updateManifest(bodyNewManifest, {
          signal: new AbortController().signal,
          name: pkgName,
          uplinksLook: false,
          requestOptions: options,
        });

        // no owners
        await expect(
          executeChangeOwners(storage, {
            _rev: bodyNewManifest._rev,
            _id: bodyNewManifest._id,
            name: pkgName,
            username: owner,
            maintainers: [],
          })
        ).rejects.toThrow();
      });

      test.each([['foo', 'publishWithOwnerDefault.yaml']])(
        'ok to publish as non-owner without check %s, %s',
        async (pkgName, configFile) => {
          const config = getConfig(configFile);
          const storage = new Storage(config, logger);
          await storage.init(config);
          const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
          const owner = 'fooUser';
          const options = { ...defaultRequestOptions, username: owner };
          await storage.updateManifest(bodyNewManifest, {
            signal: new AbortController().signal,
            name: pkgName,
            uplinksLook: false,
            requestOptions: options,
          });

          // try to publish as user who's not an owner
          const bodyNewManifest2 = generatePackageMetadata(pkgName, '1.0.1');
          const nonOwner = 'barUser';
          const options2 = { ...defaultRequestOptions, username: nonOwner };
          const message2 = await storage.updateManifest(bodyNewManifest2, {
            signal: new AbortController().signal,
            name: pkgName,
            uplinksLook: false,
            requestOptions: options2,
          });
          expect(message2).toEqual(API_MESSAGE.PKG_CHANGED);
        }
      );

      test.each([['foo', 'publishWithOwnerAndCheck.yaml']])(
        'should fail publishing as non-owner with check %s, %s',
        async (pkgName, configFile) => {
          const config = getConfig(configFile);
          const storage = new Storage(config, logger);
          await storage.init(config);
          const bodyNewManifest = generatePackageMetadata(pkgName, '1.0.0');
          const owner = 'fooUser';
          const options = { ...defaultRequestOptions, username: owner };
          await storage.updateManifest(bodyNewManifest, {
            signal: new AbortController().signal,
            name: pkgName,
            uplinksLook: false,
            requestOptions: options,
          });

          // try to publish as user who's not an owner
          const bodyNewManifest2 = generatePackageMetadata(pkgName, '1.0.1');
          const nonOwner = 'barUser';
          const options2 = { ...defaultRequestOptions, username: nonOwner };
          await expect(
            storage.updateManifest(bodyNewManifest2, {
              signal: new AbortController().signal,
              name: pkgName,
              uplinksLook: false,
              requestOptions: options2,
            })
          ).rejects.toThrow();
        }
      );
    });
  });

  describe('getLocalDatabase', () => {
    test('should return no results', async () => {
      const config = new Config(
        configExample({
          ...getDefaultConfig(),
          storage: generateRandomStorage(),
        })
      );
      const storage = new Storage(config, logger);
      await storage.init(config);
      await expect(storage.getLocalDatabase()).resolves.toHaveLength(0);
    });

    test('should return single result', async () => {
      const config = new Config(
        configExample({
          ...getDefaultConfig(),
          storage: generateRandomStorage(),
        })
      );
      const req = httpMocks.createRequest({
        method: 'GET',
        connection: { remoteAddress: fakeHost },
        headers: {
          host: 'host',
        },
        url: '/',
      });
      const storage = new Storage(config, logger);
      await storage.init(config);
      const manifest = generatePackageMetadata('foo');
      const ac = new AbortController();
      await storage.updateManifest(manifest, {
        signal: ac.signal,
        name: 'foo',
        uplinksLook: false,
        requestOptions: {
          headers: req.headers as any,
          protocol: req.protocol,
          host: req.get('host') as string,
        },
      });
      const response = await storage.getLocalDatabase();
      expect(response).toHaveLength(1);
      expect(response[0]).toEqual(expect.objectContaining({ name: 'foo', version: '1.0.0' }));
    });
  });

  describe('removePackage', () => {
    test('should remove entirely a package', async () => {
      const username = 'foouser';
      const config = new Config(
        configExample({
          ...getDefaultConfig(),
          storage: generateRandomStorage(),
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
      const storage = new Storage(config, logger);
      await storage.init(config);

      const manifest = generatePackageMetadata('foo');
      const ac = new AbortController();
      // 1. publish a package
      await storage.updateManifest(manifest, {
        signal: ac.signal,
        name: 'foo',
        uplinksLook: false,
        requestOptions: {
          headers: req.headers as any,
          protocol: req.protocol,
          host: req.get('host') as string,
        },
      });
      // 2. request package (should be available in the local cache)
      const manifest1 = (await storage.getPackageByOptions({
        name: 'foo',
        uplinksLook: false,
        requestOptions: {
          headers: req.headers as any,
          protocol: req.protocol,
          host: req.get('host') as string,
        },
      })) as Manifest;
      const _rev = manifest1._rev;
      // 3. remove the tarball
      await expect(
        storage.removeTarball(manifest1.name, 'foo-1.0.0.tgz', _rev, username)
      ).resolves.toBeDefined();
      // 4. remove the package
      await storage.removePackage(manifest1.name, _rev, username);
      // 5. fails if package does not exist anymore in storage
      await expect(
        storage.getPackageByOptions({
          name: 'foo',
          uplinksLook: false,
          requestOptions: {
            headers: req.headers as any,
            protocol: req.protocol,
            host: req.get('host') as string,
          },
        })
      ).rejects.toThrow('package does not exist on uplink: foo');
    });

    test('ok to remove package as non-owner without check', async () => {
      const config = getConfig('publishWithOwnerDefault.yaml');
      const storage = new Storage(config, logger);
      await storage.init(config);
      const owner = 'fooUser';
      const options = { ...defaultRequestOptions, username: owner };

      // 1. publish a package
      const bodyNewManifest = generatePackageMetadata('foo', '1.0.0');
      await storage.updateManifest(bodyNewManifest, {
        signal: new AbortController().signal,
        name: 'foo',
        uplinksLook: true,
        requestOptions: options,
      });
      // 2. request package (should be available in the local cache)
      const manifest1 = (await storage.getPackageByOptions({
        name: 'foo',
        uplinksLook: false,
        requestOptions: options,
      })) as Manifest;
      const _rev = manifest1._rev;
      // 3. remove the tarball as other user
      const nonOwner = 'barUser';
      await expect(
        storage.removeTarball(manifest1.name, 'foo-1.0.0.tgz', _rev, nonOwner)
      ).resolves.toBeDefined();
      // 4. remove the package as other user
      await storage.removePackage(manifest1.name, _rev, nonOwner);
      // 5. fails if package does not exist anymore in storage
      await expect(
        storage.getPackageByOptions({
          name: 'foo',
          uplinksLook: false,
          requestOptions: options,
        })
      ).rejects.toThrow('package does not exist on uplink: foo');
    });

    test('should fail as non-owner with check', async () => {
      const config = getConfig('publishWithOwnerAndCheck.yaml');
      const storage = new Storage(config, logger);
      await storage.init(config);
      const owner = 'fooUser';
      const options = { ...defaultRequestOptions, username: owner };

      // 1. publish a package
      const bodyNewManifest = generatePackageMetadata('foo', '1.0.0');
      await storage.updateManifest(bodyNewManifest, {
        signal: new AbortController().signal,
        name: 'foo',
        uplinksLook: true,
        requestOptions: options,
      });
      // 2. request package (should be available in the local cache)
      const manifest1 = (await storage.getPackageByOptions({
        name: 'foo',
        uplinksLook: false,
        requestOptions: options,
      })) as Manifest;
      const _rev = manifest1._rev;
      // 3. try removing the tarball
      const nonOwner = 'barUser';
      await expect(
        storage.removeTarball(manifest1.name, 'foo-1.0.0.tgz', _rev, nonOwner)
      ).rejects.toThrow();
      // 4. try removing the package
      await expect(storage.removePackage(manifest1.name, _rev, nonOwner)).rejects.toThrow();
    });
  });
});
