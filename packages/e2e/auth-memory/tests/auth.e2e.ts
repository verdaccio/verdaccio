import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { constants } from '@verdaccio/core';
import { allTests, createNpmAdapter, runAll } from '@verdaccio/e2e-cli';
import {
  ConfigBuilder,
  type RegistryInstance,
  startRegistry,
  stopRegistry,
} from '@verdaccio/e2e-shared';

const { ROLES } = constants;

let registry: RegistryInstance;

describe('auth-memory E2E', () => {
  beforeAll(async () => {
    registry = await startRegistry('auth-memory', {
      configBuilder: ConfigBuilder.build()
        .addStorage('./storage')
        .addUplink('npmjs', { url: 'https://registry.npmjs.org/' })
        .addPackageAccess('@*/*', {
          access: [ROLES.$ALL],
          publish: [ROLES.$AUTH],
          proxy: ['npmjs'],
        })
        .addPackageAccess('**', {
          access: [ROLES.$ALL],
          publish: [ROLES.$AUTH],
          proxy: ['npmjs'],
        })
        .addAuth({
          'auth-memory': {
            users: {
              test: { name: 'test', password: 'test' },
            },
          },
        })
        .addLogger({ type: 'stdout', format: 'pretty', level: 'warn' }),
    });
  }, 60_000);

  afterAll(() => {
    if (registry) {
      stopRegistry(registry);
    }
  });

  test('e2e-cli: ping, publish, and info with auth-memory', async () => {
    const adapter = createNpmAdapter();
    const tests = allTests.filter((t) => ['ping', 'publish', 'info'].includes(t.name));
    const { results, exitCode } = await runAll([adapter], tests, registry.url, registry.token, {
      timeout: 50_000,
      concurrency: 1,
    });

    expect(exitCode).toBe(0);
    expect(results[0].failed).toBe(0);
    expect(results[0].passed).toBe(3);
  }, 60_000);
});
