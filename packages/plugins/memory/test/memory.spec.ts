import { beforeEach, describe, expect, test, vi } from 'vitest';

import { errorUtils } from '@verdaccio/core';
import type {
  ILocalPackageManager,
  IPackageStorage,
  IPluginStorage,
  Logger,
} from '@verdaccio/legacy-types';

import LocalMemory from '../src/index';
import type { ConfigMemory } from '../src/local-memory';
import MemoryHandler from '../src/memory-handler';
import config from './partials/config';
import pkgExample from './partials/pkg';

const { getInternalError } = errorUtils;

const logger: Logger = {
  error: (e) => console.warn(e),
  info: (e) => console.warn(e),
  debug: (e) => console.warn(e),
  child: (e) => console.warn(e),
  warn: (e) => console.warn(e),
  http: (e) => console.warn(e),
  trace: (e) => console.warn(e),
};

const defaultConfig = { logger, config: null };

const { mockStringify, mockParsePackage } = vi.hoisted(() => {
  return {
    mockStringify: vi.fn(),
    mockParsePackage: vi.fn(),
  };
});

vi.mock('../src/utils', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, any>;
  mockStringify.mockImplementation((value) => actual.stringifyPackage(value));
  mockParsePackage.mockImplementation((value) => actual.parsePackage(value));
  return {
    stringifyPackage: (value: any) => mockStringify(value),
    parsePackage: (value: any) => mockParsePackage(value),
  };
});

describe('memory unit test .', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('MemoryHandler', () => {
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

    test('should save a package', () => {
      return new Promise<void>((resolve) => {
        const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
        const pkgName = 'test';

        const handler = localMemory.getPackageStorage(pkgName);
        expect(handler).toBeDefined();

        if (handler) {
          handler.savePackage(pkgName, pkgExample, (err) => {
            expect(err).toBeNull();
            handler.readPackage(pkgName, (err, data) => {
              expect(err).toBeNull();
              expect(data).toEqual(pkgExample);
              resolve();
            });
          });
        }
      });
    });

    test('should fails on save a package', () => {
      return new Promise<void>((resolve) => {
        mockStringify.mockImplementationOnce(() => {
          throw new Error('error on parse');
        });

        const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
        const pkgName = 'test';

        const handler: IPackageStorage = localMemory.getPackageStorage(
          pkgName
        ) as ILocalPackageManager;

        handler.savePackage(pkgName, pkgExample, (err) => {
          expect(err).toEqual(getInternalError('error on parse'));
          resolve();
        });
      });
    });

    test('should fails on read a package', () => {
      return new Promise<void>((resolve) => {
        const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
        const pkgName = 'test';

        const handler = localMemory.getPackageStorage(pkgName);
        expect(handler).toBeDefined();

        if (handler) {
          handler.readPackage(pkgName, (err) => {
            expect(err).not.toBeNull();
            expect(err.code).toBe(404);
            resolve();
          });
        }
      });
    });

    test('should update a package', () => {
      return new Promise<void>((resolve) => {
        const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
        const pkgName = 'test';

        const handler = localMemory.getPackageStorage(pkgName);
        expect(handler).toBeDefined();
        const onEnd = vi.fn();

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
                resolve();
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
    });

    test('should parse fails on update a package', () => {
      return new Promise<void>((resolve) => {
        mockParsePackage.mockImplementationOnce(() => {
          throw new Error('error on parse');
        });
        const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);

        const pkgName = 'test';

        const handler = localMemory.getPackageStorage(pkgName);
        expect(handler).toBeDefined();
        let endError: any = undefined;
        const onEnd = vi.fn((err) => {
          endError = err;
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
            expect(endError).not.toBeNull();
            expect(endError.message).toBe('error on parse');
            resolve();
          });
        }
      });
    });

    test('should fail updateHandler update a package', () => {
      return new Promise<void>((resolve) => {
        const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
        const pkgName = 'test';

        const handler = localMemory.getPackageStorage(pkgName);
        expect(handler).toBeDefined();
        const onEnd = vi.fn((err) => {
          expect(err).not.toBeNull();
          expect(err).toEqual(getInternalError('some error'));
          resolve();
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
                callback(getInternalError('some error'));
              },
              () => {},
              // @ts-ignore
              () => {},
              onEnd
            );
          });
        }
      });
    });

    test('should onWrite update a package', () => {
      return new Promise<void>((resolve) => {
        const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
        const pkgName = 'test';

        const handler = localMemory.getPackageStorage(pkgName);
        expect(handler).toBeDefined();
        const onEnd = vi.fn((err) => {
          expect(err).not.toBeNull();
          expect(err).toEqual(getInternalError('error on parse the metadata'));
          resolve();
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
                resolve();
              },
              () => {
                throw new Error('dadsads');
              },
              onEnd
            );
          });
        }
      });
    });

    describe('writing/reading files', () => {
      test('should write a tarball', () => {
        return new Promise<void>((resolve) => {
          const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
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
              resolve();
            });

            stream.write(dataTarball);
          }
        });
      });

      test('should support writting identical tarball filenames from different packages', () => {
        return new Promise<void>((resolve) => {
          const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
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
                  resolve();
                });

                stream.write(dataTarball2);
              }
            });

            stream.write(dataTarball1);
          }
        });
      });

      test('should read a tarball', () => {
        return new Promise<void>((resolve) => {
          const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
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
                resolve();
              });
            });
            stream.write(dataTarball);
          }
        });
      });

      test('should abort read a tarball', () => {
        return new Promise<void>((resolve) => {
          const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
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
                resolve();
              });
            });
            stream.write(dataTarball);
          }
        });
      });

      test('should fails read a tarball not found', () => {
        return new Promise<void>((resolve) => {
          const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
          const pkgName = 'test2.tar.gz';
          const handler = localMemory.getPackageStorage(pkgName);

          if (handler) {
            const readStream = handler.readTarball('not-found');
            readStream.on('error', (err) => {
              expect(err).not.toBeNull();
              expect(err.message).toMatch(/no such package/);
              resolve();
            });
          }
        });
      });

      test('should abort while write a tarball', () => {
        return new Promise<void>((resolve) => {
          const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
          const pkgName = 'test-abort.tar.gz';
          const dataTarball = '12345';

          const handler = localMemory.getPackageStorage(pkgName);

          if (handler) {
            const stream = handler.writeTarball(pkgName);
            stream.on('error', (err) => {
              expect(err).not.toBeNull();
              expect(err.message).toMatch(/transmision aborted/);
              resolve();
            });
            stream.on('open', () => {
              stream.abort();
            });

            stream.write(dataTarball);
          }
        });
      });

      test('should delete a package', () => {
        return new Promise<void>((resolve) => {
          const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
          const pkgName = 'test2';

          const handler: IPackageStorage = localMemory.getPackageStorage(pkgName);
          expect(handler).toBeDefined();
          if (handler) {
            handler.createPackage(pkgName, pkgExample, (err) => {
              expect(err).toBeNull();
              handler.deletePackage(pkgName, (err) => {
                expect(err).toBeNull();
                handler.readPackage(pkgName, (err) => {
                  expect(err).not.toBeNull();
                  expect(err.message).toMatch(/no such package/);
                  resolve();
                });
              });
            });
          }
        });
      });
    });
  });
});
