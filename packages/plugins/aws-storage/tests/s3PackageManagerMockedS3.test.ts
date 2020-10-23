import { PackageAccess } from '@verdaccio/types';

import S3PackageManager from '../src/s3PackageManager';
import { S3Config } from '../src/config';

import logger from './__mocks__/Logger';
import pkg from './__fixtures__/pkg';

const mockHeadObject = jest.fn();
const mockPutObject = jest.fn();
const mockDeleteObject = jest.fn();
const mockListObject = jest.fn();
const mockDeleteObjects = jest.fn();
const mockGetObject = jest.fn();

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    headObject: mockHeadObject,
    putObject: mockPutObject,
    deleteObject: mockDeleteObject,
    listObjectsV2: mockListObject,
    deleteObjects: mockDeleteObjects,
    getObject: mockGetObject,
  })),
}));

describe('S3PackageManager with mocked s3', function () {
  beforeEach(() => {
    mockHeadObject.mockClear();
    mockPutObject.mockClear();
    mockDeleteObject.mockClear();
    mockDeleteObjects.mockClear();
    mockListObject.mockClear();
    mockGetObject.mockClear();
  });
  test('existing packages on s3 are not recreated', (done) => {
    expect.assertions(1);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'keyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    } as S3Config;

    mockHeadObject.mockImplementation((params, callback) => {
      callback();
    });

    const testPackageManager = new S3PackageManager(config, 'test-package', logger);

    testPackageManager.createPackage('test-0.0.0.tgz', pkg, (err) => {
      expect(err.message).toEqual('file already exists');
      done();
    });
  });

  test('new package is created on s3', (done) => {
    expect.assertions(2);

    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'keyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    } as S3Config;

    mockHeadObject.mockImplementation((params, callback) => {
      callback({ code: 'NoSuchKey' }, 'some data');
    });

    mockPutObject.mockImplementation((params, callback) => {
      callback();
    });

    const testPackageManager = new S3PackageManager(config, 'test-package', logger);

    testPackageManager.createPackage('test-0.0.0.tgz', pkg, (err) => {
      expect(err).toBeUndefined();
      expect(mockPutObject).toHaveBeenCalled();
      done();
    });
  });

  test('new package is uploaded to keyprefix if custom storage is not specified', (done) => {
    expect.assertions(1);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    } as S3Config;

    mockHeadObject.mockImplementation((params, callback) => {
      callback({ code: 'NoSuchKey' }, 'some data');
    });

    mockPutObject.mockImplementation((params, callback) => {
      callback();
    });

    const testPackageManager = new S3PackageManager(config, 'test-package', logger);

    testPackageManager.createPackage('test-0.0.0.tgz', pkg, () => {
      expect(mockPutObject).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: 'test-bucket',
          Key: 'testKeyPrefix/test-package/package.json',
        }),
        expect.any(Function)
      );
      done();
    });
  });

  test('new package is uploaded to custom storage prefix as specified on package section in config', (done) => {
    expect.assertions(2);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customFolder',
      })) as PackageAccess,
    } as S3Config;

    mockHeadObject.mockImplementation((params, callback) => {
      callback({ code: 'NoSuchKey' }, 'some data');
    });

    mockPutObject.mockImplementation((params, callback) => {
      callback();
    });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.createPackage('test-0.0.0.tgz', pkg, () => {
      expect(mockHeadObject).toHaveBeenCalledWith(
        {
          Bucket: 'test-bucket',
          Key: 'testKeyPrefix/customFolder/@company/test-package/package.json',
        },
        expect.any(Function)
      );
      expect(mockPutObject).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: 'test-bucket',
          Key: 'testKeyPrefix/customFolder/@company/test-package/package.json',
        }),
        expect.any(Function)
      );
      done();
    });
  });

  test('delete package with custom folder from s3 bucket', (done) => {
    expect.assertions(1);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customFolder',
      })) as PackageAccess,
    } as S3Config;

    mockDeleteObject.mockImplementation((params, callback) => {
      callback();
    });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.deletePackage('test-0.0.0.tgz', () => {
      expect(mockDeleteObject).toHaveBeenCalledWith(
        {
          Bucket: 'test-bucket',
          Key: 'testKeyPrefix/customFolder/@company/test-package/test-0.0.0.tgz',
        },
        expect.any(Function)
      );
      done();
    });
  });

  test('delete package from s3 bucket', (done) => {
    expect.assertions(1);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => ({})) as PackageAccess,
    } as S3Config;

    mockDeleteObject.mockImplementation((params, callback) => {
      callback();
    });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.deletePackage('test-0.0.0.tgz', () => {
      expect(mockDeleteObject).toHaveBeenCalledWith(
        {
          Bucket: 'test-bucket',
          Key: 'testKeyPrefix/@company/test-package/test-0.0.0.tgz',
        },
        expect.any(Function)
      );
      done();
    });
  });

  test('remove packages from s3 bucket', (done) => {
    expect.assertions(2);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => ({})) as PackageAccess,
    } as S3Config;

    mockListObject.mockImplementation((params, callback) => {
      callback(null, { KeyCount: 1 });
    });

    mockDeleteObjects.mockImplementation((params, callback) => {
      callback();
    });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.removePackage(() => {
      expect(mockDeleteObjects).toHaveBeenCalledWith(
        {
          Bucket: 'test-bucket',
          Delete: { Objects: [] },
        },
        expect.any(Function)
      );
      expect(mockListObject).toHaveBeenCalledWith(
        {
          Bucket: 'test-bucket',
          Prefix: 'testKeyPrefix/@company/test-package',
        },
        expect.any(Function)
      );
      done();
    });
  });

  test('remove packages with custom storage from s3 bucket', (done) => {
    expect.assertions(2);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customFolder',
      })) as PackageAccess,
    } as S3Config;

    mockListObject.mockImplementation((params, callback) => {
      callback(null, { KeyCount: 1 });
    });

    mockDeleteObjects.mockImplementation((params, callback) => {
      callback();
    });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.removePackage(() => {
      expect(mockDeleteObjects).toHaveBeenCalledWith(
        {
          Bucket: 'test-bucket',
          Delete: { Objects: [] },
        },
        expect.any(Function)
      );
      expect(mockListObject).toHaveBeenCalledWith(
        {
          Bucket: 'test-bucket',
          Prefix: 'testKeyPrefix/customFolder/@company/test-package',
        },
        expect.any(Function)
      );
      done();
    });
  });

  test('read packages with custom storage from s3 bucket', (done) => {
    expect.assertions(1);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customStorage',
      })) as PackageAccess,
    } as S3Config;

    mockGetObject.mockImplementation((params, callback) => {
      callback(null, { Body: JSON.stringify({ some: 'data' }) });
    });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.readPackage('some package', () => {
      expect(mockGetObject).toHaveBeenCalledWith(
        {
          Bucket: 'test-bucket',
          Key: 'testKeyPrefix/customStorage/@company/test-package/package.json',
        },
        expect.any(Function)
      );
      done();
    });
  });

  test('read packages from s3 bucket', (done) => {
    expect.assertions(1);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    } as S3Config;

    mockGetObject.mockImplementation((params, callback) => {
      callback(null, { Body: JSON.stringify({ some: 'data' }) });
    });

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.readPackage('some package', () => {
      expect(mockGetObject).toHaveBeenCalledWith(
        {
          Bucket: 'test-bucket',
          Key: 'testKeyPrefix/@company/test-package/package.json',
        },
        expect.any(Function)
      );
      done();
    });
  });

  test('read tarballs from s3 bucket', () => {
    expect.assertions(1);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    } as S3Config;

    mockGetObject.mockImplementation((params) => {
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
      Key: 'testKeyPrefix/@company/test-package/tarballfile.gz',
    });
  });

  test('read tarballs for a custom folder from s3 bucket', () => {
    expect.assertions(1);
    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => ({
        storage: 'customStorage',
      })) as PackageAccess,
    } as S3Config;

    mockGetObject.mockImplementation((params) => {
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

  test('write tarballs from s3 bucket', () => {
    expect.assertions(1);

    const config: S3Config = {
      bucket: 'test-bucket',
      keyPrefix: 'testKeyPrefix/',
      getMatchedPackagesSpec: jest.fn(() => null) as PackageAccess,
    } as S3Config;

    mockHeadObject.mockImplementation(() => {});

    const testPackageManager = new S3PackageManager(config, '@company/test-package', logger);

    testPackageManager.writeTarball('tarballfile.gz');

    expect(mockHeadObject).toHaveBeenCalledWith(
      {
        Bucket: 'test-bucket',
        Key: 'testKeyPrefix/@company/test-package/tarballfile.gz',
      },
      expect.any(Function)
    );
  });

  test('write tarballs with custom storage from s3 bucket', () => {
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
