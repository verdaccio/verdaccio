import { Logger, IPluginStorage } from '@verdaccio/types';
import { VerdaccioError } from '@verdaccio/commons-api';

import { ConfigMemory } from '../src/local-memory';
import { DataHandler } from '../src/memory-handler';
import LocalMemory from '../src/index';

import config from './partials/config';

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

describe('memory unit test .', () => {
  describe('LocalMemory', () => {
    test('should create an LocalMemory instance', () => {
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);

      expect(localMemory).toBeDefined();
    });

    test('should create add a package', (done) => {
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);
      localMemory.add('test', (err: VerdaccioError) => {
        expect(err).toBeNull();
        localMemory.get((err: VerdaccioError, data: DataHandler) => {
          expect(err).toBeNull();
          expect(data).toHaveLength(1);
          done();
        });
      });
    });

    test('should reach max limit', (done) => {
      config.limit = 2;
      const localMemory: IPluginStorage<ConfigMemory> = new LocalMemory(config, defaultConfig);

      localMemory.add('test1', (err) => {
        expect(err).toBeNull();
        localMemory.add('test2', (err) => {
          expect(err).toBeNull();
          localMemory.add('test3', (err) => {
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
      localMemory.add(pkgName, (err) => {
        expect(err).toBeNull();
        localMemory.remove(pkgName, (err) => {
          expect(err).toBeNull();
          localMemory.get((err, data) => {
            expect(err).toBeNull();
            expect(data).toHaveLength(0);
            done();
          });
        });
      });
    });
  });
});
