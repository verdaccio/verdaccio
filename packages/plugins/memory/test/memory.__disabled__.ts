import { join } from 'node:path';

import { Config, parseConfigFile } from '@verdaccio/config';
import { errorUtils, pluginUtils } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import LocalMemory from '../src/index';
import { ConfigMemory } from '../src/local-memory';
import MemoryHandler from '../src/memory-handler';
import pkgExample from './partials/pkg';

await setup({});

const config = new Config(parseConfigFile(join(__dirname, 'config.yaml')));

const defaultConfig = { logger, config };

const mockStringify = jest.fn((value) => {
  return jest.requireActual('../src/utils.ts').stringifyPackage(value);
});

const mockParsePackage = jest.fn((value) => {
  return jest.requireActual('../src/utils.ts').parsePackage(value);
});

jest.mock('../src/utils.ts', () => ({
  stringifyPackage: (value) => mockStringify(value),
  parsePackage: (value) => mockParsePackage(value),
}));

describe('memory unit test .', () => {
  test('should create an MemoryHandler instance', () => {
    const memoryHandler = new MemoryHandler(
      'test',
      {
        ['foo']: 'bar',
      },
      logger
    );

    expect(memoryHandler).toBeDefined();
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('should save a package', (done) => {
  //   const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
  //   const pkgName = 'test';

  //   const handler = localMemory.getPackageStorage(pkgName);
  //   expect(handler).toBeDefined();

  //   if (handler) {
  //     handler.savePackage(pkgName, pkgExample, (err) => {
  //       expect(err).toBeNull();
  //       handler.readPackage(pkgName, (err, data) => {
  //         expect(err).toBeNull();
  //         expect(data).toEqual(pkgExample);
  //         done();
  //       });
  //     });
  //   }
  // });

  test('should fails on save a package', (done) => {
    mockStringify.mockImplementationOnce(() => {
      throw new Error('error on parse');
    });

    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test';

    const handler = localMemory.getPackageStorage(pkgName);

    handler.savePackage(pkgName, pkgExample, (err) => {
      expect(err).toEqual(errorUtils.getInternalError('error on parse'));
      done();
    });
  });

  test('should fails on read a package', async () => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test';

    const handler = localMemory.getPackageStorage(pkgName);
    expect(handler).toBeDefined();

    if (handler) {
      await expect(handler.readPackage(pkgName)).rejects.toThrow();
    }
  });

  test('should update a package', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test';

    const handler = localMemory.getPackageStorage(pkgName);
    expect(handler).toBeDefined();
    const onEnd = jest.fn();

    if (handler) {
      handler.savePackage(pkgName, pkgExample, (err) => {
        expect(err).toBeNull();

        handler.updatePackage(
          pkgName,
          (json, callback) => {
            expect(json).toBeDefined();
            expect(json.name).toBe(pkgExample.name);
            expect(callback).toBeDefined();
            callback(null);
          },
          (name, data, onEnd) => {
            expect(name).toBe(pkgName);
            expect(data.name).toBe(pkgExample.name);
            onEnd();
            expect(onEnd).toHaveBeenCalled();
            done();
          },
          (data) => {
            expect(data).toBeDefined();
            return data;
          },
          onEnd
        );
      });
    }
  });

  test('should parse fails on update a package', (done) => {
    mockParsePackage.mockImplementationOnce(() => {
      throw new Error('error on parse');
    });
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);

    const pkgName = 'test';

    const handler = localMemory.getPackageStorage(pkgName);
    expect(handler).toBeDefined();
    const onEnd = jest.fn((err) => {
      expect(err).not.toBeNull();
      expect(err).toEqual(errorUtils.getInternalError('error on parse'));
      done();
    });

    if (handler) {
      handler.savePackage(pkgName, pkgExample, (err) => {
        expect(err).toBeNull();
        handler.updatePackage(
          pkgName,
          () => {},
          () => {},
          // @ts-ignore
          () => {},
          onEnd
        );
      });
    }
  });

  test('should fail updateHandler update a package', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test';

    const handler = localMemory.getPackageStorage(pkgName);
    expect(handler).toBeDefined();
    const onEnd = jest.fn((err) => {
      expect(err).not.toBeNull();
      expect(err).toEqual(errorUtils.getInternalError('some error'));
      done();
    });

    if (handler) {
      handler.savePackage(pkgName, pkgExample, (err) => {
        expect(err).toBeNull();

        handler.updatePackage(
          pkgName,
          (json, callback) => {
            expect(json).toBeDefined();
            expect(json.name).toBe(pkgExample.name);
            expect(callback).toBeDefined();
            callback(errorUtils.getInternalError('some error'));
          },
          () => {},
          // @ts-ignore
          () => {},
          onEnd
        );
      });
    }
  });

  test('should onWrite update a package', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test';

    const handler = localMemory.getPackageStorage(pkgName);
    expect(handler).toBeDefined();
    const onEnd = jest.fn((err) => {
      expect(err).not.toBeNull();
      expect(err).toEqual(errorUtils.getInternalError('error on parse the metadata'));
      done();
    });

    if (handler) {
      handler.savePackage(pkgName, pkgExample, (err) => {
        expect(err).toBeNull();

        handler.updatePackage(
          pkgName,
          (json, callback) => {
            expect(json).toBeDefined();
            expect(json.name).toBe(pkgExample.name);
            expect(callback).toBeDefined();
            callback(null);
          },
          (name, data, onEnd) => {
            expect(name).toBe(pkgName);
            expect(data.name).toBe(pkgExample.name);
            onEnd();
            expect(onEnd).toHaveBeenCalled();
            done();
          },
          () => {
            throw new Error('dadsads');
          },
          onEnd
        );
      });
    }
  });

  test('should delete a package', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test2';

    const handler = localMemory.getPackageStorage(pkgName);
    expect(handler).toBeDefined();
    if (handler) {
      handler.createPackage(pkgName, pkgExample, (err) => {
        expect(err).toBeNull();
        handler.deletePackage(pkgName).then((err) => {
          expect(err).toBeUndefined();
          handler.readPackage(pkgName, (err) => {
            expect(err).not.toBeNull();
            expect(err.message).toMatch(/no such package/);
            done();
          });
        });
      });
    }
  });
});

describe('writing files', () => {
  test('should write a tarball', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test';
    const dataTarball = '12345';

    const handler = localMemory.getPackageStorage(pkgName);
    if (handler) {
      const stream = handler.writeTarball(pkgName);
      stream.on('data', (data) => {
        expect(data.toString()).toBe(dataTarball);
      });
      stream.on('open', () => {
        stream.done();
        stream.end();
      });
      stream.on('success', () => {
        done();
      });

      stream.write(dataTarball);
    }
  });
  test('should abort while write a tarball', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test-abort.tar.gz';
    const handler = localMemory.getPackageStorage(pkgName);

    if (handler) {
      const stream = handler.writeTarball(pkgName);
      stream.on('error', (err) => {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/transmision aborted/);
        done();
      });
      stream.on('open', () => {
        stream.abort();
      });
    }
  });

  test('should support writting identical tarball filenames from different packages', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName1 = 'package1';
    const pkgName2 = 'package2';
    const filename = 'tarball-3.0.0.tgz';
    const dataTarball1 = '12345';
    const dataTarball2 = '12345678';
    const handler = localMemory.getPackageStorage(pkgName1);
    if (handler) {
      const stream = handler.writeTarball(filename);
      stream.on('data', (data) => {
        expect(data.toString()).toBe(dataTarball1);
      });
      stream.on('open', () => {
        stream.done();
        stream.end();
      });
      stream.on('success', () => {
        const handler = localMemory.getPackageStorage(pkgName2);
        if (handler) {
          const stream = handler.writeTarball(filename);
          stream.on('data', (data) => {
            expect(data.toString()).toBe(dataTarball2);
          });
          stream.on('open', () => {
            stream.done();
            stream.end();
          });
          stream.on('success', () => {
            done();
          });

          stream.write(dataTarball2);
        }
      });

      stream.write(dataTarball1);
    }
  });
});

describe('reading files', () => {
  test('should read a tarball', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test.tar.gz';
    const dataTarball = '12345';

    const handler = localMemory.getPackageStorage(pkgName);

    if (handler) {
      const stream = handler.writeTarball(pkgName);
      stream.on('open', () => {
        stream.done();
        stream.end();
      });
      stream.on('success', () => {
        const readStream = handler.readTarball(pkgName);
        readStream.on('data', (data) => {
          expect(data.toString()).toBe(dataTarball);
          done();
        });
      });
      stream.write(dataTarball);
    }
  });

  test('should abort read a tarball', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test2.tar.gz';
    const dataTarball = '12345';

    const handler = localMemory.getPackageStorage(pkgName);

    if (handler) {
      const stream = handler.writeTarball(pkgName);
      stream.on('open', () => {
        stream.done();
        stream.end();
      });
      stream.on('success', () => {
        const readStream = handler.readTarball(pkgName);
        readStream.on('data', () => {
          readStream.abort();
        });
        readStream.on('error', (err) => {
          expect(err).not.toBeNull();
          expect(err.message).toMatch(/read has been aborted/);
          done();
        });
      });
      stream.write(dataTarball);
    }
  });

  test('should fails read a tarball not found', (done) => {
    const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(config, defaultConfig);
    const pkgName = 'test2.tar.gz';
    const handler = localMemory.getPackageStorage(pkgName);

    if (handler) {
      const readStream = handler.readTarball('not-found');
      readStream.on('error', (err) => {
        expect(err).not.toBeNull();
        expect(err.message).toMatch(/no such package/);
        done();
      });
    }
  });
});
