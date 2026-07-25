import { fileUtils, getDefaultConfig, startVerdaccio } from 'verdaccio';
import { expect, test } from 'vitest';

test('ESM: startVerdaccio should be able to listen', async () => {
  const storage = await fileUtils.createTempStorageFolder('legacy-test');
  expect(typeof startVerdaccio).toBe('function');

  const defaultConfig = { ...getDefaultConfig(), storage };

  return new Promise((done) => {
    startVerdaccio(defaultConfig, '5000', storage, '1.0.0', 'verdaccio', (server, addr) => {
      expect(server).toBeDefined();
      expect(addr).toBeDefined();
      expect(addr.port).toBe('5000');
      server.close();
      done(true);
    });
  });
});
