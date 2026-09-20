import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type * as workerThreads from 'node:worker_threads';
import { afterAll, afterEach, describe, expect, test, vi } from 'vitest';

const { register, unregister } = vi.hoisted(() => ({
  register: vi.fn(),
  unregister: vi.fn(),
}));

vi.mock('on-exit-leak-free', () => ({ register, unregister }));
// buildSafeSonicBoom only registers exit handlers on the main thread; force it
// so the test does not depend on the vitest worker pool
vi.mock('node:worker_threads', async (importOriginal) => ({
  ...(await importOriginal<typeof workerThreads>()),
  isMainThread: true,
}));

import { buildSafeSonicBoom } from '../src/prettify';

describe('buildSafeSonicBoom exit handling', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prettify-'));
  let fileCount = 0;
  const nextDest = () => path.join(tmpDir, `out-${fileCount++}.log`);

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('registers a flush-on-exit handler for async streams', async () => {
    const stream = buildSafeSonicBoom({ dest: nextDest(), sync: false });

    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith(stream, expect.any(Function));

    await new Promise<void>((resolve) => {
      stream.on('close', () => resolve());
      stream.end();
    });
    expect(unregister).toHaveBeenCalledWith(stream);
  });

  test('does not register an exit handler for sync streams', () => {
    const stream = buildSafeSonicBoom({ dest: nextDest(), sync: true });

    expect(register).not.toHaveBeenCalled();
    stream.destroy();
  });

  test('flush-on-exit handler ends the stream so buffered logs are not lost', async () => {
    const dest = nextDest();
    const stream = buildSafeSonicBoom({ dest, sync: false });
    await new Promise<void>((resolve) => stream.once('ready', () => resolve()));
    stream.write('tail line\n');

    const autoEnd = register.mock.calls[0][1];
    await new Promise<void>((resolve) => {
      stream.on('close', () => resolve());
      // simulate the process exit callback from on-exit-leak-free
      autoEnd(stream, 'beforeExit');
    });

    expect(fs.readFileSync(dest, 'utf8')).toContain('tail line');
  });
});
