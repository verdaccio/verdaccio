import { describe, expect, test } from 'vitest';

import { PLUGIN_CATEGORY } from '@verdaccio/core';
import { verifyPlugin } from '@verdaccio/plugin-verifier';

describe('Plugin loading verification', () => {
  test('should be loadable by verdaccio as a filter plugin', async () => {
    const result = await verifyPlugin({
      pluginPath: '@verdaccio/package-filter',
      category: PLUGIN_CATEGORY.FILTER,
    });

    expect(result.success).toBe(true);
    expect(result.pluginsLoaded).toBe(1);
  });
});
