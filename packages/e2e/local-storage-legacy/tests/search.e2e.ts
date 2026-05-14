import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { allTests, createNpmAdapter, runAll } from '@verdaccio/e2e-cli';
import { type RegistryInstance, startRegistry, stopRegistry } from '@verdaccio/e2e-shared';

let registry: RegistryInstance;

describe('local-storage-legacy E2E: search', () => {
  beforeAll(async () => {
    registry = await startRegistry('local-storage-legacy');
  }, 60_000);

  afterAll(() => {
    if (registry) {
      stopRegistry(registry);
    }
  });

  test('e2e-cli: publish and search tests pass', async () => {
    const adapter = createNpmAdapter();
    const tests = allTests.filter((t) => ['publish', 'search'].includes(t.name));
    const { results, exitCode } = await runAll([adapter], tests, registry.url, registry.token, {
      timeout: 50_000,
      concurrency: 1,
    });

    expect(exitCode).toBe(0);
    expect(results[0].failed).toBe(0);
    expect(results[0].passed).toBe(2);
  }, 60_000);
});
