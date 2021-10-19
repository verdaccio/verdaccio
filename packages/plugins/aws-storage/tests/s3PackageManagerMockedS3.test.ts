import { PackageAccess } from '@verdaccio/types';

import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ObjectIdentifier,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { S3Configuration } from '../src/config';
import S3PackageManager from '../src/s3PackageManager';

import logger from './__mocks__/Logger';
import pkg from './__fixtures__/pkg';

describe('S3PackageManager with mocked s3', function () {
  const s3Client = mockClient(S3Client);

  beforeEach(() => {
    s3Client.reset();
  });

  test('existing packages on s3 are not recreated', (done) => {
    expect.assertions(1);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'keyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    };
    s3Client.on(HeadObjectCommand).resolves({});

    const testPackageManager = new S3PackageManager(config, 'test-package', logger);

    testPackageManager.createPackage('test-0.0.0.tgz', pkg, (err) => {
      expect(err.message).toEqual('file already exists');
      done();
    });
  });

  test('new package is created on s3', (done) => {
    expect.assertions(2);

    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'keyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    };

    s3Client
      .on(HeadObjectCommand)
      .rejects({ Code: 'NoSuchKey' })
      .on(PutObjectCommand)
      .resolves(null);

    const testPackageManager = new S3PackageManager(config, 'test-package', logger);

    testPackageManager.createPackage('test-0.0.0.tgz', pkg, (err) => {
      expect(err).toBeNull();
      expect(s3Client.calls().length).toBe(2);
      done();
    });
  });

  test('new package is uploaded to keyprefix if custom storage is not specified', (done) => {
    expect.assertions(1);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    };

    s3Client
      .on(HeadObjectCommand, {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/test-package/package.json',
      })
      .rejects({ Code: 'NoSuchKey' })
      .on(PutObjectCommand, {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/test-package/package.json',
      })
      .resolves(null);

    const testPackageManager = new S3PackageManager(config, 'test-package', logger);

    testPackageManager.createPackage('test-0.0.0.tgz', pkg, () => {
      expect(s3Client.send.called).toBeTruthy();
      done();
    });
  });

  test('new package is uploaded to custom storage prefix', (done) => {
    expect.assertions(1);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customFolder',
      })) as PackageAccess,
    };

    s3Client
      .on(HeadObjectCommand, {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/customFolder/@company/test-package/package.json',
      })
      .rejects({ Code: 'NoSuckKey' })
      .on(PutObjectCommand, {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/customFolder/@company/test-package/package.json',
      })
      .resolves(null);

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.createPackage('test-0.0.0.tgz', pkg, () => {
      expect(s3Client.send.called).toBe(true);
      done();
    });
  });

  test('delete package with custom folder from s3 bucket', (done) => {
    expect.assertions(1);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customFolder',
      })) as PackageAccess,
    };

    s3Client
      .on(DeleteObjectCommand, {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/customFolder/@company/test-package/test-0.0.0.tgz',
      })
      .resolves(null);

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.deletePackage('test-0.0.0.tgz', () => {
      expect(s3Client.send.called).toBe(true);
      done();
    });
  });

  test('delete package from s3 bucket', (done) => {
    expect.assertions(1);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => ({})) as PackageAccess,
    };

    s3Client
      .on(DeleteObjectCommand, {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/@company/test-package/test-0.0.0.tgz',
      })
      .resolves({});

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.deletePackage('test-0.0.0.tgz', () => {
      expect(s3Client.send.called).toBeTruthy();
      done();
    });
  });

  test('remove packages from s3 bucket', (done) => {
    expect.assertions(2);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => ({})) as PackageAccess,
    };

    s3Client
      .onAnyCommand()
      .rejects()
      .on(ListObjectsV2Command, {
        Bucket: 'test-bucket',
        Prefix: 'testKeyPrefix/@company/test-package/',
      })
      .resolves({
        KeyCount: 1,
        Contents: [{ Key: 'testKeyPrefix/@company/test-package/package.json' }],
      })
      .on(DeleteObjectsCommand, {
        Bucket: 'test-bucket',
        Delete: {
          Objects: [
            {
              Key: 'testKeyPrefix/@company/test-package/package.json',
            } as ObjectIdentifier,
          ],
        },
      })
      .resolves(null);

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.removePackage((err) => {
      expect(err).toBeNull();
      expect(s3Client.send.getCalls().length).toBe(2);
      done();
    });
  });

  test('remove packages with custom storage from s3 bucket', (done) => {
    expect.assertions(2);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customFolder',
      })) as PackageAccess,
    };

    s3Client
      .onAnyCommand()
      .rejects()
      .on(ListObjectsV2Command, {
        Bucket: 'test-bucket',
        Prefix: 'testKeyPrefix/customFolder/@company/test-package/',
      })
      .resolves({
        KeyCount: 1,
        Contents: [{ Key: 'testKeyPrefix/@company/test-package/package.json' }],
      })
      .on(DeleteObjectsCommand, {
        Bucket: 'test-bucket',
        Delete: {
          Objects: [
            {
              Key: 'testKeyPrefix/@company/test-package/package.json',
            } as ObjectIdentifier,
          ],
        },
      })
      .resolves({});

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.removePackage((err) => {
      expect(err).toBeNull();
      expect(s3Client.send.getCalls().length).toBe(2);
      done();
    });
  });

  test('read packages with custom storage from s3 bucket', (done) => {
    expect.assertions(2);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customStorage',
      })) as PackageAccess,
    };

    s3Client
      .onAnyCommand()
      .rejects()
      .on(GetObjectCommand, {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/customStorage/@company/test-package/package.json',
      })
      // @ts-ignore
      .resolves({ Body: JSON.stringify({ some: 'data' }) });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.readPackage('some package', (err) => {
      expect(err).toBeNull();
      expect(s3Client.send.called).toBe(true);
      done();
    });
  });

  test('read packages from s3 bucket', (done) => {
    expect.assertions(2);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    };

    s3Client
      .onAnyCommand()
      .rejects()
      .on(GetObjectCommand, {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/@company/test-package/package.json',
      })
      // @ts-ignore
      .resolves({ Body: JSON.stringify({ some: 'data' }) });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.readPackage('some package', (err, data) => {
      expect(err).toBeNull();
      expect(data).not.toBeFalsy();
      done();
    });
  });

  test.skip('read tarballs from s3 bucket', () => {
    expect.assertions(1);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    };

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.readTarball('tarballfile.gz');

    expect(mockGetObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'testKeyPrefix/@company/test-package/tarballfile.gz',
    });
  });

  test.skip('read tarballs for a custom folder from s3 bucket', () => {
    expect.assertions(1);
    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customStorage',
      })) as PackageAccess,
    };

    mockGetObject.mockImplementation(() => {
      return {
        on: jest.fn(() => ({
          createReadStream: jest.fn(() => ({
            on: jest.fn(),
            pipe: jest.fn(),
          })),
        })),
      };
    });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.readTarball('tarballfile.gz');

    expect(mockGetObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'testKeyPrefix/customStorage/@company/test-package/tarballfile.gz',
    });
  });

  test.skip('write tarballs from s3 bucket', () => {
    expect.assertions(1);

    const config: S3Configuration = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      // @ts-ignore
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    };
    s3Client
      .onAnyCommand()
      .rejects()
      .on(HeadObjectCommand, {
        Bucket: 'test-bucket',
        Key: 'estKeyPrefix/@company/test-package/tarballfile.gz',
      })
      .resolves({});

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.writeTarball('tarballfile.gz');
  });

  test.skip('write tarballs with custom storage from s3 bucket', () => {
    expect.assertions(1);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customStorage',
      })) as PackageAccess,
    } as S3Config;

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    mockHeadObject.mockImplementation(() => {});

    testPackageManager.writeTarball('tarballfile.gz');

    expect(mockHeadObject).toHaveBeenCalledWith(
      {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/customStorage/@company/test-package/tarballfile.gz',
      },
      expect.any(Function)
    );
  });
});
