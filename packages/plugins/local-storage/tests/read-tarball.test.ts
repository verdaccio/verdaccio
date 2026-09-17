import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { finished } from 'node:stream/promises';
import { afterEach, describe, expect, test, vi } from 'vitest';

import type { Logger } from '@verdaccio/types';

import LocalFS from '../src/local-fs';

const cleanups: Array<() => Promise<void>> = [];

afterEach(async () => {
  for (const cleanup of cleanups.splice(0)) await cleanup();
  vi.restoreAllMocks();
});

describe('LocalFS tarball content-length ordering', () => {
  test.each([
    { name: 'an empty file', content: Buffer.alloc(0) },
    { name: 'a small binary file', content: Buffer.from([0x00, 0xff, 0x80, 0x1f, 0x8b]) },
    { name: 'a file larger than the read buffer', content: Buffer.alloc(192 * 1024 + 17, 0xab) },
  ])('emits the size before any data for $name', async ({ content }) => {
    const root = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'verdaccio-read-tarball-'));
    cleanups.push(() => fsPromises.rm(root, { recursive: true, force: true }));
    const fileName = 'download-1.0.0.tgz';
    await fsPromises.writeFile(path.join(root, fileName), content);
    const logger: Logger = {
      error: vi.fn(),
      info: vi.fn(),
      debug: vi.fn(),
      child: vi.fn(),
      warn: vi.fn(),
      http: vi.fn(),
      trace: vi.fn(),
      fatal: vi.fn(),
    };
    const localFs = new LocalFS(root, logger);

    // If size measurement becomes asynchronous again, force its callback to
    // finish after reading starts. This reproduces the old race deterministically.
    const reading = Promise.withResolvers<void>();
    const pendingStats: Promise<void>[] = [];
    const fstat = fs.fstat;
    vi.spyOn(fs, 'fstat').mockImplementation((...args) => {
      const callback = args.at(-1) as (
        error: NodeJS.ErrnoException | null,
        stats: fs.Stats
      ) => void;
      pendingStats.push(
        new Promise<void>((resolve) => {
          fstat(args[0], (error, stats) => {
            void reading.promise.then(() => {
              callback(error, stats);
              resolve();
            });
          });
        })
      );
    });

    const stream = await localFs.readTarball(fileName, { signal: new AbortController().signal });
    const closed = finished(stream, { cleanup: true });
    const events: string[] = [];
    const sizes: number[] = [];
    const chunks: Buffer[] = [];
    stream.on('content-length', (size) => {
      events.push('content-length');
      sizes.push(size);
    });
    stream.on('data', (chunk) => {
      events.push('data');
      chunks.push(Buffer.from(chunk));
      reading.resolve();
    });
    stream.on('end', () => {
      events.push('end');
      reading.resolve();
    });
    try {
      await closed;
      await Promise.all(pendingStats);
      expect(events[0]).toBe('content-length');
      expect(sizes).toEqual([content.length]);
      expect(Buffer.concat(chunks)).toEqual(content);
      if (content.length > stream.readableHighWaterMark) expect(chunks.length).toBeGreaterThan(1);
    } finally {
      reading.resolve();
      stream.destroy();
      await closed.catch(() => {});
      await Promise.all(pendingStats);
    }
  });
});
