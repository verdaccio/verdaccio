import { join } from 'path';

import { runServer } from '../../../../src';
import { parseConfigFile } from '../../../../src/lib/utils';

describe('bootstrap modern', () => {
  describe('runServer', () => {
    test('run server should be able to listen', (done) => {
      const configPath = join(__dirname, './config.yaml');
      runServer(configPath).then((app) => {
        app.listen(4000, () => {
          app.close();
          done();
        });
      });
    });

    test('run server should be able to listen with object', (done) => {
      const configPath = join(__dirname, './config.yaml');
      const c = parseConfigFile(configPath);
      // workaround
      // on v5 the `self_path` still exists and will be removed in v6
      c.self_path = 'foo';
      runServer(c).then((app) => {
        app.listen(4000, () => {
          app.close();
          done();
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
  });
});
