import { join } from 'path';
import { describe, expect, test } from 'vitest';

import { parseConfigFile } from '@verdaccio/config';

import { runServer } from '../../../../src';

describe('bootstrap modern', () => {
  describe('runServer', () => {
    test('run server should be able to listen', () => {
      const configPath = join(__dirname, './config.yaml');
      return new Promise((done) => {
        runServer(configPath).then((app) => {
          expect(app).toBeDefined();
          app.listen(4000, () => {
            app.close();
            done(true);
          });
        });
      });
    });

    test('run server should be able to listen with object', () => {
      const configPath = join(__dirname, './config.yaml');
      const config = parseConfigFile(configPath);
      // workaround
      // on v5 the `self_path` still exists and will be removed in future versions
      // @ts-expect-error
      config.self_path = 'foo';
      return new Promise((done) => {
        runServer(config).then((app) => {
          app.listen(4000, () => {
            app.close();
            done(true);
          });
        });
      });
    });

    test('run server should be able to listen async', async () => {
      const configPath = join(__dirname, './config.yaml');
      const app = await runServer(configPath);
      return new Promise((resolve) => {
        app.listen(4000, () => {
          app.close();
          resolve(true);
        });
      });
    });

    test('run server should fails with wrong path', async () => {
      const configPath = join(__dirname, './this_does_not_exist.yaml');
      await expect(runServer(configPath)).rejects.toThrow(
        'config file does not exist or not reachable'
      );
    });
  });
});
