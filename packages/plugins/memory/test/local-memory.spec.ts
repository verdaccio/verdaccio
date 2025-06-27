import { join } from 'node:path';
import { Readable } from 'node:stream';
import { describe, expect, test } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';
import { Token } from '@verdaccio/types';

import LocalMemory from '../src/index';
import pkgExample from './partials/pkg';

setup({});

const config = new Config(parseConfigFile(join(__dirname, 'config.yaml')));

const defaultConfig = { logger, config };

describe('LocalMemory', () => {
  describe('package tests', () => {
    test('should create an LocalMemory instance', () => {
      const localMemory = new LocalMemory({ limit: 10 }, { ...defaultConfig, config });

      expect(localMemory).toBeDefined();
    });

    test('should create add a package', () => {
      return new Promise((done) => {
        const localMemory = new LocalMemory({ limit: 10 }, { ...defaultConfig, config });
        localMemory.add('test').then(() => {
          localMemory.get().then((data) => {
            expect(data).toHaveLength(1);
            done(true);
          });
        });
      });
    });

    test('should reach max limit', () => {
      return new Promise((done) => {
        const localMemory = new LocalMemory({ limit: 2 }, defaultConfig);

        localMemory.add('test1').then(() => {
          localMemory.add('test2').then(() => {
            localMemory.add('test3').catch((err) => {
              expect(err).not.toBeNull();
              expect(err.message).toMatch(/Storage memory has reached limit of 2 packages/);
              done(true);
            });
          });
        });
      });
    });

    test('should remove a package', () => {
      return new Promise((done) => {
        const pkgName = 'test4';
        const localMemory = new LocalMemory({}, { ...defaultConfig, config });
        localMemory.add(pkgName).then(() => {
          localMemory.remove(pkgName).then(() => {
            localMemory.get().then((data) => {
              expect(data).toHaveLength(0);
              done(true);
            });
          });
        });
      });
    });

    test('should search for packages by substring', async () => {
      const localMemory = new LocalMemory({}, { ...defaultConfig, config });
      await localMemory.add('alpha');
      await localMemory.add('beta');
      await localMemory.add('alphabet');
      const results = await localMemory.search({
        text: 'alp',
        quality: 1,
        popularity: 1,
        maintenance: 1,
      });
      expect(results.map((r) => r.package.name).sort()).toEqual(['alpha', 'alphabet']);
    });
  });

  describe('token tests', () => {
    test('should save a token for a user', () => {
      return new Promise((done) => {
        const localMemory = new LocalMemory({}, { ...defaultConfig, config });

        const token1: Token = {
          user: 'testuser',
          token: 'test-token-1',
          key: 'test-key-1',
          readonly: false,
          created: Date.now(),
        };

        const token2: Token = {
          user: 'testuser',
          token: 'test-token-2',
          key: 'test-key-2',
          readonly: true,
          created: Date.now(),
        };

        localMemory.saveToken(token1).then(() => {
          localMemory.saveToken(token2).then(() => {
            localMemory.readTokens({ user: 'testuser' }).then((tokens) => {
              expect(tokens).toHaveLength(2);
              expect(tokens).toContainEqual(token1);
              expect(tokens).toContainEqual(token2);
              done(true);
            });
          });
        });
      });
    });

    test('should delete a token for a user', () => {
      return new Promise((done) => {
        const localMemory = new LocalMemory({}, { ...defaultConfig, config });

        const token1: Token = {
          user: 'testuser',
          token: 'test-token-1',
          key: 'test-key-1',
          readonly: false,
          created: Date.now(),
        };

        const token2: Token = {
          user: 'testuser',
          token: 'test-token-2',
          key: 'test-key-2',
          readonly: true,
          created: Date.now(),
        };

        localMemory.saveToken(token1).then(() => {
          localMemory.saveToken(token2).then(() => {
            localMemory.deleteToken('testuser', 'test-key-1').then(() => {
              localMemory.readTokens({ user: 'testuser' }).then((tokens) => {
                expect(tokens).toHaveLength(1);
                expect(tokens[0]).toEqual(token2);
                done(true);
              });
            });
          });
        });
      });
    });

    test('should handle deleting a token for a non-existent user', () => {
      return new Promise((done) => {
        const localMemory = new LocalMemory({}, { ...defaultConfig, config });

        localMemory.deleteToken('nouser', 'nokey').catch((err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toMatch(/user not found/);
          done(true);
        });
      });
    });

    test('should return empty array for user with no tokens', () => {
      return new Promise((done) => {
        const localMemory = new LocalMemory({}, { ...defaultConfig, config });

        localMemory.readTokens({ user: 'emptyuser' }).then((tokens) => {
          expect(tokens).toEqual([]);
          done(true);
        });
      });
    });
  });

  describe('tarball tests', () => {
    test('should write, read, and delete a tarball', async () => {
      const localMemory = new LocalMemory({}, { ...defaultConfig, config });
      const pkgName = 'test';
      const tarballName = 'test-1.0.0.tgz';

      const storage = localMemory.getPackageStorage(pkgName);

      // Directly set the data for testing
      // @ts-ignore - accessing private prop for testing
      localMemory.data.files[`${pkgName}/${tarballName}`] = 'true';

      // Check tarball exists
      const hasTarball = await storage.hasTarball(tarballName);
      expect(hasTarball).toBe(true);

      // Delete tarball
      await storage.deletePackage(tarballName);

      // Check tarball no longer exists
      const hasTarballAfterDelete = await storage.hasTarball(tarballName);
      expect(hasTarballAfterDelete).toBe(false);
    });

    test('should write, read, and delete a tarball for a scoped package', async () => {
      const localMemory = new LocalMemory({}, { ...defaultConfig, config });
      const pkgName = '@scope/test_npm';
      const tarballName = 'test_npm-1.0.1.tgz';

      const storage = localMemory.getPackageStorage(pkgName);

      // Directly set the data for testing
      // @ts-ignore - accessing private prop for testing
      localMemory.data.files[`${pkgName}/${tarballName}`] = 'true';

      // Check tarball exists
      const hasTarball = await storage.hasTarball(tarballName);
      expect(hasTarball).toBe(true);

      // Delete tarball
      await storage.deletePackage(tarballName);

      // Check tarball no longer exists
      const hasTarballAfterDelete = await storage.hasTarball(tarballName);
      expect(hasTarballAfterDelete).toBe(false);
    });

    test('should create, read, update, and delete a scoped package', async () => {
      const localMemory = new LocalMemory({}, { ...defaultConfig, config });
      const pkgName = '@scope/test';
      const handler = localMemory.getPackageStorage(pkgName);
      // Create
      await handler.createPackage(pkgName, pkgExample);
      // Read
      const readManifest = await handler.readPackage(pkgName);
      expect(readManifest.name).toBe(pkgExample.name);
      // Update
      const updated = await handler.updatePackage(pkgName, async (json) => {
        json.description = 'updated description';
        return json;
      });
      expect(updated.description).toBe('updated description');
      // Delete
      await handler.removePackage(pkgName);
      await expect(handler.readPackage(pkgName)).rejects.toThrow(/no such package/);
    });

    test('should handle tarball upload stream events correctly for storage.ts integration', async () => {
      const localMemory = new LocalMemory({}, { ...defaultConfig, config });
      const pkgName = 'stream-test';
      const tarballName = 'stream-test-1.0.0.tgz';
      const tarballContent = Buffer.from('test tarball content');

      const storage = localMemory.getPackageStorage(pkgName);

      // Create a readable stream from our test content
      const contentStream = Readable.from(tarballContent);

      // Set up event capturing to verify the event sequence
      const events: string[] = [];

      // Set up abort controller
      const abortController = new AbortController();

      // Get write stream from storage handler
      const writeStream = await storage.writeTarball(tarballName, {
        signal: abortController.signal,
      });

      // Track open event
      writeStream.on('open', () => {
        events.push('open');
      });

      // Track finish event
      writeStream.on('finish', () => {
        events.push('finish');
      });

      // Track close event
      writeStream.on('close', () => {
        events.push('close');
      });

      // Create a promise that resolves when the pipe completes
      const pipePromise = new Promise<void>((resolve, reject) => {
        // Pipe the content through the write stream
        contentStream.pipe(writeStream);

        writeStream.on('error', reject);
        writeStream.on('close', () => {
          // Add a small delay to ensure the close event handler in memory-handler
          // has completed its work (renaming temp file and updating data mapping)
          setTimeout(resolve, 10);
        });
      });

      // Wait for piping to complete
      await pipePromise;

      // Check tarball was written correctly
      expect(await storage.hasTarball(tarballName)).toBe(true);

      // Verify events occurred in the correct order
      expect(events).toContain('open');
      expect(events).toContain('finish');
      expect(events).toContain('close');

      // Verify proper order: open -> finish -> close
      const openIdx = events.indexOf('open');
      const finishIdx = events.indexOf('finish');
      const closeIdx = events.indexOf('close');

      expect(openIdx).toBeLessThan(finishIdx);
      expect(finishIdx).toBeLessThan(closeIdx);

      // Create another abort controller for reading
      const readAbortController = new AbortController();

      // Read back the written content to verify
      const readStream = await storage.readTarball(tarballName, {
        signal: readAbortController.signal,
      });

      // Collect the content from the read stream
      const chunks: Buffer[] = [];
      for await (const chunk of readStream) {
        chunks.push(Buffer.from(chunk));
      }

      // Verify content integrity
      const readContent = Buffer.concat(chunks);
      expect(readContent.toString()).toEqual(tarballContent.toString());
    });
  });
});
