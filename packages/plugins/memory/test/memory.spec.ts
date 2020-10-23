import { Logger, IPluginStorage, IPackageStorage, ILocalPackageManager } from '@verdaccio/types';
import { getInternalError } from '@verdaccio/commons-api';

import { ConfigMemory } from '../src/local-memory';
import MemoryHandler from '../src/memory-handler';
import LocalMemory from '../src/index';

import config from './partials/config';
import pkgExample from './partials/pkg';

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

    test('should save a package', (done) => {
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
            done();
          });
        });
      }
    });

    test('should fails on save a package', (done) => {
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
        done();
      });
    });

    test('should fails on read a package', (done) => {
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
      const pkgName = 'test';

      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();

      if (handler) {
        handler.readPackage(pkgName, (err) => {
          expect(err).not.toBeNull();
          expect(err.code).toBe(404);
          done();
        });
      }
    });

    test('should update a package', (done) => {
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
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
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);

      const pkgName = 'test';

      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();
      const onEnd = jest.fn((err) => {
        expect(err).not.toBeNull();
        expect(err).toEqual(getInternalError('error on parse'));
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
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
      const pkgName = 'test';

      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();
      const onEnd = jest.fn((err) => {
        expect(err).not.toBeNull();
        expect(err).toEqual(getInternalError('some error'));
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

    test('should onWrite update a package', (done) => {
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
      const pkgName = 'test';

      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();
      const onEnd = jest.fn((err) => {
        expect(err).not.toBeNull();
        expect(err).toEqual(getInternalError('error on parse the metadata'));
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

    describe('writing/reading files', () => {
      test('should write a tarball', (done) => {
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
            done();
          });

          stream.write(dataTarball);
        }
      });

      test('should read a tarball', (done) => {
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
              done();
            });
          });
          stream.write(dataTarball);
        }
      });

      test('should abort read a tarball', (done) => {
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
              done();
            });
          });
          stream.write(dataTarball);
        }
      });

      test('should fails read a tarball not found', (done) => {
        const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
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

      test('should abort while write a tarball', (done) => {
        const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
        const pkgName = 'test-abort.tar.gz';
        const dataTarball = '12345';

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

          stream.write(dataTarball);
        }
      });

      test('should delete a package', (done) => {
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
                done();
              });
            });
          });
        }
      });
    });
  });
});
