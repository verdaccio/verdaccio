import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { PLUGIN_CATEGORY } from '@verdaccio/core';
import { verifyPlugin } from '@verdaccio/plugin-verifier';

describe('Plugin loading verification', () => {
  test('should be loadable by verdaccio as an authentication plugin', async () => {
    const result = await verifyPlugin({
      pluginPath: 'htpasswd',
      category: PLUGIN_CATEGORY.AUTHENTICATION,
      pluginConfig: { file: join(tmpdir(), 'htpasswd-verify-test') },
      configPath: join(tmpdir(), 'verdaccio-config.yaml'),
    });

    expect(result.success).toBe(true);
    expect(result.pluginsLoaded).toBe(1);
  });
});
