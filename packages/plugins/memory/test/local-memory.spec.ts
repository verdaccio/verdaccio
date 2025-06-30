import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { pluginUtils } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import LocalMemory from '../src/index';
import { ConfigMemory } from '../src/local-memory';

await setup({});

const config = new Config(parseConfigFile(join(__dirname, 'config.yaml')));

const defaultConfig = { logger, config };

describe('memory unit test .', () => {
  describe('LocalMemory', () => {
    test('should create an LocalMemory instance', () => {
      const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(
        { limit: 10 },
        { ...defaultConfig, config }
      );

      expect(localMemory).toBeDefined();
    });

    test('should create add a package', () => {
      return new Promise((done) => {
        const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(
          { limit: 10 },
          { ...defaultConfig, config }
        );
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
        const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(
          { limit: 2 },
          defaultConfig
        );

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
        const pkgName = 'test';
        const localMemory: pluginUtils.Storage<ConfigMemory> = new LocalMemory(
          {},
          { ...defaultConfig, config }
        );
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
  });
});
