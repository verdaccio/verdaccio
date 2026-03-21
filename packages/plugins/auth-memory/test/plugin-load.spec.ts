import { describe, expect, test } from 'vitest';

import { PLUGIN_CATEGORY } from '@verdaccio/core';
import { verifyPlugin } from '@verdaccio/plugin-verifier';

describe('Plugin loading verification', () => {
  test('should be loadable by verdaccio as an authentication plugin', async () => {
    const result = await verifyPlugin({
      pluginPath: 'auth-memory',
      category: PLUGIN_CATEGORY.AUTHENTICATION,
    });

    expect(result.success).toBe(true);
    expect(result.pluginsLoaded).toBe(1);
  });
});
