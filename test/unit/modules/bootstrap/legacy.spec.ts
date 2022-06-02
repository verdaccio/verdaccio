import { join } from 'path';

import { startVerdaccio } from '../../../../src';
import { parseConfigFile } from '../../../../src/lib/utils';

describe('bootstrap legacy', () => {
  describe('startVerdaccio', () => {
    test('run server should be able to listen', (done) => {
      const p = join(__dirname, './config.yaml');
      const cache = join(__dirname, 'cache');
      const config = parseConfigFile(p);
      startVerdaccio(config, '5000', cache, '1.0.0', 'verdaccio', (server, addr) => {
        server.close();
        done();
      });
    });
  });
});
