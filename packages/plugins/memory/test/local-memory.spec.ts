import { join } from 'path';

import { Config, parseConfigFile } from '@verdaccio/config';
import { logger, setup } from '@verdaccio/logger';
import { IPluginStorage } from '@verdaccio/types';

import LocalMemory from '../src/index';
import { ConfigMemory } from '../src/local-memory';
import { DataHandler } from '../src/memory-handler';

setup();

const config = new Config(parseConfigFile(join(__dirname, 'config.yaml')));

const defaultConfig = { logger, config };

describe('memory unit test .', () => {
  describe('LocalMemory', () => {
    test('should create an LocalMemory instance', () => {
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);

      expect(localMemory).toBeDefined();
    });

    test('should create add a package', (done) => {
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
      localMemory.add('test').then(() => {
        localMemory.get().then((data: DataHandler) => {
          expect(data).toHaveLength(1);
          done();
        });
      });
    });

    test('should reach max limit', (done) => {
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(
        // @ts-ignore
        { limit: 2 },
        defaultConfig
      );

      localMemory.add('test1').then(() => {
        localMemory.add('test2').then(() => {
          localMemory.add('test3').catch((err) => {
            expect(err).not.toBeNull();
            expect(err.message).toMatch(/Storage memory has reached limit of limit packages/);
            done();
          });
        });
      });
    });

    test('should remove a package', (done) => {
      const pkgName = 'test';
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
      localMemory.add(pkgName).then(() => {
        localMemory.remove(pkgName).then(() => {
          localMemory.get().then((data) => {
            expect(data).toHaveLength(0);
            done();
          });
        });
      });
    });
  });
});
