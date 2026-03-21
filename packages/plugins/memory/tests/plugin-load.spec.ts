import { describe, expect, test } from 'vitest';

import { PLUGIN_CATEGORY } from '@verdaccio/core';
import { verifyPlugin } from '@verdaccio/plugin-verifier';

describe('Plugin loading verification', () => {
  test('should be loadable by verdaccio as a storage plugin', async () => {
    const result = await verifyPlugin({
      pluginPath: 'memory',
      category: PLUGIN_CATEGORY.STORAGE,
    });

    expect(result.success).toBe(true);
    expect(result.pluginsLoaded).toBe(1);
  });
});
