import { createRequire } from 'module';
import { expect, test } from 'vitest';

const require = createRequire(import.meta.url);
const { runServer, getDefaultConfig, fileUtils } = require('verdaccio');

test('CJS: runServer should start correctly with default config', async () => {
  const storage = await fileUtils.createTempStorageFolder('cjs-test');
  expect(typeof runServer).toBe('function');

  const defaultConfig = { ...getDefaultConfig(), storage };
  const server = await runServer(defaultConfig);

  expect(server).toBeDefined();
  expect(server).toHaveProperty('listen');

  if (server && typeof server.close === 'function') {
    await server.close();
  }
});
