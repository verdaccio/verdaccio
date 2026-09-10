import { once } from 'node:events';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import pino from 'pino';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { LoggerFormat } from '@verdaccio/types';

describe.each(['development', 'production'])('file destination in %s', (environment) => {
  let directory: string;
  let destinations: ReturnType<typeof pino.destination>[];
  let originalListeners: ReturnType<typeof process.listeners>;

  beforeEach(() => {
    directory = mkdtempSync(join(tmpdir(), 'logger-sync-'));
    destinations = [];
    originalListeners = process.listeners('SIGUSR2');
    vi.stubEnv('NODE_ENV', environment);
    vi.resetModules();
    const createDestination = pino.destination;
    vi.spyOn(pino, 'destination').mockImplementation((options) => {
      const destination = createDestination(options);
      destinations.push(destination);
      return destination;
    });
  });

  afterEach(async () => {
    for (const destination of destinations) {
      if (destination.destroyed) continue;
      const closed = once(destination, 'close');
      destination.end();
      await closed;
    }
    for (const listener of process.listeners('SIGUSR2')) {
      if (!originalListeners.includes(listener)) process.removeListener('SIGUSR2', listener);
    }
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.resetModules();
    rmSync(directory, { recursive: true, force: true });
  });

  describe.each([true, false, undefined])('sync=%s', (sync) => {
    const formats: (LoggerFormat | undefined)[] =
      environment === 'production' ? ['json', 'pretty', 'pretty-timestamped', undefined] : ['json'];

    test.each(formats)('writes JSON with the requested mode for format %s', async (format) => {
      const { prepareSetup } = await import('../src/logger');
      const path = join(directory, 'logger.log');
      const logger = await prepareSetup(
        { type: 'file', path, level: 'info', format, ...(sync === undefined ? {} : { sync }) },
        pino
      );

      expect(destinations).toHaveLength(1);
      expect(destinations[0].sync).toBe(sync ?? false);
      logger.info('first message');
      logger.info('second message');
      // Sync must make even short messages readable before yielding or flushing.
      if (!sync) {
        const closed = once(destinations[0], 'close');
        destinations[0].end();
        await closed;
      }
      expect(
        readFileSync(path, 'utf8')
          .trim()
          .split('\n')
          .map((line) => JSON.parse(line).msg)
      ).toEqual(['first message', 'second message']);
    });

    test('rejects setup when the log directory does not exist', async () => {
      vi.restoreAllMocks();
      const { prepareSetup } = await import('../src/logger');
      await expect(
        prepareSetup(
          {
            type: 'file',
            path: join(directory, 'missing', 'logger.log'),
            format: 'json',
            ...(sync === undefined ? {} : { sync }),
          },
          pino
        )
      ).rejects.toMatchObject({ code: 'ENOENT' });
    });
  });
});
