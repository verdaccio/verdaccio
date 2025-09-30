import { join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { errorUtils } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import LocalMemory from '../src/index';
import MemoryHandler from '../src/memory-handler';
import pkgExample from './partials/pkg';

setup({});

const config = new Config(parseConfigFile(join(__dirname, 'config.yaml')));

const defaultConfig = { logger, config };
const memoryConfig = { limit: 10 };

const mockStringify = vi.fn((value) => JSON.stringify(value));
const mockParsePackage = vi.fn((value) => JSON.parse(value));

vi.mock('../src/utils.ts', () => ({
  stringifyPackage: (value) => mockStringify(value),
  parsePackage: (value) => mockParsePackage(value),
}));

describe('MemoryHandler', () => {
  describe('package tests', () => {
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

    test('should fail on save a package', async () => {
      mockStringify.mockImplementationOnce(() => {
        throw new Error('error on parse');
      });
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test2';
      const handler = localMemory.getPackageStorage(pkgName);
      await expect(handler.savePackage(pkgName, pkgExample)).rejects.toEqual(
        errorUtils.getInternalError('error on parse')
      );
    });

    test('should fail on read a package', async () => {
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test3';
      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();
      await expect(handler.readPackage(pkgName)).rejects.toThrow();
    });

    test('should update a package', async () => {
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test4';
      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();
      await handler.savePackage(pkgName, pkgExample);
      const updated = await handler.updatePackage(pkgName, async (json) => {
        expect(json).toBeDefined();
        expect(json.name).toBe(pkgExample.name);
        return json;
      });
      expect(updated).toBeDefined();
      expect(updated.name).toBe(pkgExample.name);
    });

    test('should fail on update a package', async () => {
      mockParsePackage.mockImplementationOnce(() => {
        throw new Error('error on parse');
      });
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test5';
      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();
      await handler.savePackage(pkgName, pkgExample);
      await expect(handler.updatePackage(pkgName, async (json) => json)).rejects.toEqual(
        errorUtils.getInternalError('error on parse')
      );
    });

    test('should fail updateHandler update a package', async () => {
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test6';
      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();
      await handler.savePackage(pkgName, pkgExample);
      await expect(
        handler.updatePackage(pkgName, async () => {
          throw errorUtils.getInternalError('some error');
        })
      ).rejects.toEqual(errorUtils.getInternalError('some error'));
    });

    test('should fail on update a package', async () => {
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test7';
      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();
      await handler.savePackage(pkgName, pkgExample);
      await expect(
        handler.updatePackage(pkgName, async () => {
          throw new Error('error on parse the metadata');
        })
      ).rejects.toEqual(errorUtils.getInternalError('error on parse the metadata'));
    });

    test('should delete a package', async () => {
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test8';
      const handler = localMemory.getPackageStorage(pkgName);
      expect(handler).toBeDefined();
      await handler.createPackage(pkgName, pkgExample);
      await handler.removePackage(pkgName);
      await expect(handler.readPackage(pkgName)).rejects.toThrow(/no such package/);
    });
  });

  describe('tarball tests', () => {
    test('should read a tarball', async () => {
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test9';
      const dataTarball = '12345';

      const handler = localMemory.getPackageStorage(pkgName);
      const abort = new AbortController();

      if (handler) {
        const stream = await handler.writeTarball(pkgName, { signal: abort.signal });
        stream.on('open', () => {
          stream.end();
        });
        stream.on('success', async () => {
          const readStream = await handler.readTarball(pkgName, { signal: abort.signal });
          readStream.on('data', (data) => {
            expect(data.toString()).toBe(dataTarball);
          });
        });
        stream.write(dataTarball);
      }
    });

    test('should abort read a tarball', async () => {
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test10';
      const dataTarball = '12345';

      const handler = localMemory.getPackageStorage(pkgName);
      const abort = new AbortController();

      if (handler) {
        const stream = await handler.writeTarball(pkgName, { signal: abort.signal });
        stream.on('open', () => {
          stream.end();
        });
        stream.on('success', async () => {
          const readStream = await handler.readTarball(pkgName, { signal: abort.signal });
          readStream.on('data', () => {
            abort.abort();
          });
          readStream.on('error', (err) => {
            expect(err).not.toBeNull();
            expect(err.message).toMatch(/read has been aborted/);
          });
        });
        stream.write(dataTarball);
      }
    });

    test('should fail read a tarball not found', async () => {
      const localMemory = new LocalMemory(memoryConfig, defaultConfig);
      const pkgName = 'test11';
      const handler = localMemory.getPackageStorage(pkgName);
      const abort = new AbortController();

      if (handler) {
        try {
          await handler.readTarball('not-found', { signal: abort.signal });
          throw new Error('Expected error was not thrown');
        } catch (err: any) {
          expect(err).not.toBeNull();
          expect(err.message).toMatch(/no such package/);
        }
      }
    });
  });
});
