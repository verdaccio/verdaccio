import { fileUtils, getDefaultConfig, runServer } from 'verdaccio';
import { expect, test } from 'vitest';

test('ESM: runServer should start correctly with default config', async () => {
  const storage = await fileUtils.createTempStorageFolder('esm-test');
  expect(typeof runServer).toBe('function');

  const defaultConfig = { ...getDefaultConfig(), storage };
  const server = await runServer(defaultConfig);

  expect(server).toBeDefined();
  expect(server).toHaveProperty('listen');

  if (server && typeof server.close === 'function') {
    await server.close();
  }
});
