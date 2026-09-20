import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

describe('failed file destination at process exit', () => {
  let directory: string;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'logger-failed-destination-'));
  });

  afterEach(() => {
    rmSync(directory, { recursive: true, force: true });
  });

  describe.each([true, false, undefined])('sync=%s', (sync) => {
    test.each(['natural', 'explicit'])('handles %s exit after ENOENT', (exitMode) => {
      // Use a real main process: Pino does not register its exit hook in workers.
      // The build is also used by logger.spec.ts and is produced before tests in CI.
      const buildPath = join(import.meta.dirname, '..', 'build');
      const outputPath = join(directory, 'working.log');
      const script = `
        const assert = require('node:assert/strict');
        const pino = require('pino');
        const { prepareSetup } = require(${JSON.stringify(buildPath)});
        const originalDestination = pino.destination;
        // Keep failed streams alive so GC cannot hide a leaked exit registration.
        globalThis.destinations = [];
        pino.destination = (options) => {
          const destination = originalDestination(options);
          globalThis.destinations.push(destination);
          return destination;
        };
        async function main() {
          // Keep a healthy registration active while cleaning up the failed one.
          const logger = await prepareSetup(${JSON.stringify({ type: 'file', path: outputPath, format: 'json', sync: false })}, pino);
          const listeners = process.listeners('SIGUSR2');
          await assert.rejects(prepareSetup(${JSON.stringify({ type: 'file', path: join(directory, 'missing', 'logger.log'), format: 'json', sync })}, pino), { code: 'ENOENT' });
          assert.deepEqual(process.listeners('SIGUSR2'), listeners);
          // Cleaning up a failed destination must not disable flushing healthy ones.
          logger.info('healthy destination still flushes');
          if (${JSON.stringify(exitMode)} === 'explicit') process.exit(0);
        }
        main().catch((error) => { console.error(error); process.exitCode = 1; });
      `;

      const result = spawnSync(process.execPath, ['-e', script], {
        cwd: join(import.meta.dirname, '..'),
        encoding: 'utf8',
        timeout: 5000,
      });

      expect(result.error).toBeUndefined();
      expect(result.signal).toBeNull();
      expect(result.stderr).toBe('');
      expect(result.status).toBe(0);
      expect(JSON.parse(readFileSync(outputPath, 'utf8')).msg).toBe(
        'healthy destination still flushes'
      );
    });
  });
});
