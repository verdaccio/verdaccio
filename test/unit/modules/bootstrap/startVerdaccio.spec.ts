import { join } from 'path';
import { describe, expect, test } from 'vitest';

import startVerdaccioDeault, { startVerdaccio } from '../../../../src';
import { setup } from '../../../../src/lib/logger';
import { parseConfigFile } from '../../../../src/lib/utils';

setup({});

describe('bootstrap legacy', () => {
  describe('startVerdaccio', () => {
    test('run server should be able to listen', () => {
      const p = join(__dirname, './config.yaml');
      const cache = join(__dirname, 'cache');
      const config = parseConfigFile(p);
      return new Promise((done) => {
        startVerdaccio(config, '5000', cache, '1.0.0', 'verdaccio', (server, addr) => {
          expect(server).toBeDefined();
          expect(addr).toBeDefined();
          expect(addr.port).toBe('5000');
          server.close();
          done(true);
        });
      });
    });

    test('run server should be able to listen default method', () => {
      const p = join(__dirname, './config.yaml');
      const cache = join(__dirname, 'cache');
      const config = parseConfigFile(p);
      return new Promise((done) => {
        startVerdaccioDeault(config, '5000', cache, '1.0.0', 'verdaccio', (server, addr) => {
          server.close();
          expect(server).toBeDefined();
          expect(addr).toBeDefined();
          expect(addr.port).toBe('5000');
          done(true);
        });
      });
    });
  });
});
