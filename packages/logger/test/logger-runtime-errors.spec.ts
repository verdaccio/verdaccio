import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import pino from 'pino';
import SonicBoom from 'sonic-boom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const require = createRequire(import.meta.url);
// SonicBoom opens via CJS require('fs'); ESM namespace exports are not patchable.
const fsCjs = require('node:fs') as typeof import('node:fs');

// In-process (unlike the subprocess exit specs): coverage tools can't see
// code run in a spawned child, so prepareSetup's error/reopen paths need this too.
describe('file destination runtime error handling (in-process)', () => {
  let directory: string;
  let liveDir: string;
  let outputPath: string;
  let originalSigusr2Listeners: NodeJS.SignalsListener[];

  beforeEach(() => {
    directory = fs.mkdtempSync(join(tmpdir(), 'logger-runtime-'));
    liveDir = join(directory, 'live');
    fs.mkdirSync(liveDir);
    outputPath = join(liveDir, 'output.log');
    originalSigusr2Listeners = process.listeners('SIGUSR2') as NodeJS.SignalsListener[];
  });

  afterEach(() => {
    for (const listener of process.listeners('SIGUSR2')) {
      if (!originalSigusr2Listeners.includes(listener as NodeJS.SignalsListener)) {
        process.removeListener('SIGUSR2', listener as NodeJS.SignalsListener);
      }
    }
    fs.rmSync(directory, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  // A `pino`-shaped stub, injected via prepareSetup's own `pino` param instead
  // of mutating the shared module, that captures writes to the stderr (dest: 2) reporter.
  function pinoCapturingStderr(reports: string[]): typeof pino {
    return new Proxy(pino, {
      apply(target, thisArg, args) {
        return Reflect.apply(target as unknown as (...a: unknown[]) => unknown, thisArg, args);
      },
      get(target, prop, receiver) {
        if (prop === 'destination') {
          return (opts: any) => {
            const dest = target.destination(opts);
            if (opts && opts.dest === 2) {
              dest.write = (chunk: any) => {
                reports.push(String(chunk));
                return true;
              };
            }
            return dest;
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  test('reports a runtime write error once per Error instance, then keeps logging', async () => {
    const { prepareSetup } = await import('../src/logger');
    const reports: string[] = [];
    const logger = await prepareSetup(
      { type: 'file', path: outputPath, format: 'json', sync: false },
      pinoCapturingStderr(reports)
    );
    const destination = (logger as any)[pino.symbols.streamSym];

    const error = Object.assign(new Error('disk full'), { code: 'ENOSPC' });
    destination.emit('error', error);
    destination.emit('error', error); // same instance: pino/SonicBoom can re-emit it, must be deduped
    const otherError = Object.assign(new Error('disk full again'), { code: 'ENOSPC' });
    destination.emit('error', otherError);

    expect(reports).toHaveLength(2);
    for (const report of reports) {
      expect(JSON.parse(report)).toMatchObject({
        level: 50,
        path: outputPath,
        err: { code: 'ENOSPC' },
      });
    }

    // The destination itself must not have been torn down by the errors.
    logger.info('still alive');
    await new Promise<void>((resolve, reject) =>
      logger.flush((err: Error | null) => (err ? reject(err) : resolve()))
    );
  });

  test('a normal reopen succeeds and resets the reopen bookkeeping for the next call', async () => {
    const { prepareSetup } = await import('../src/logger');
    const reports: string[] = [];
    const logger = await prepareSetup(
      { type: 'file', path: outputPath, format: 'json', sync: false },
      pinoCapturingStderr(reports)
    );
    const destination = (logger as any)[pino.symbols.streamSym];

    await new Promise<void>((resolve) => {
      destination.once('ready', resolve);
      destination.reopen();
    });
    // Proves `reopening` was reset after the first call.
    await new Promise<void>((resolve) => {
      destination.once('ready', resolve);
      destination.reopen();
    });

    expect(reports).toHaveLength(0);
  });

  test('a synchronous reopen failure is reported and a later reopen still recovers', async () => {
    const { prepareSetup } = await import('../src/logger');
    const reports: string[] = [];
    const logger = await prepareSetup(
      { type: 'file', path: outputPath, format: 'json', sync: true },
      pinoCapturingStderr(reports)
    );
    const destination = (logger as any)[pino.symbols.streamSym];

    // Stub openSync: Windows cannot rename a directory while SonicBoom holds the fd.
    const originalOpenSync = fsCjs.openSync;
    fsCjs.openSync = ((file: fs.PathLike, ...args: any[]) => {
      if (file !== outputPath) {
        return originalOpenSync(file, ...(args as [fs.OpenMode?, fs.Mode?]));
      }
      throw Object.assign(new Error('ENOENT during test'), { code: 'ENOENT' });
    }) as typeof fsCjs.openSync;
    try {
      // Sync reopen throws synchronously here; the wrapper must catch it.
      destination.reopen();
    } finally {
      fsCjs.openSync = originalOpenSync;
    }

    expect(reports).toHaveLength(1);
    expect(JSON.parse(reports[0])).toMatchObject({
      level: 50,
      path: outputPath,
      err: { code: 'ENOENT' },
    });

    await new Promise<void>((resolve) => {
      destination.once('ready', resolve);
      destination.reopen();
    });

    logger.info('recovered');
  });

  test('calling reopen() directly twice before the first settles does not double-register cleanup', async () => {
    const { prepareSetup } = await import('../src/logger');
    const reports: string[] = [];
    const logger = await prepareSetup(
      { type: 'file', path: outputPath, format: 'json', sync: false },
      pinoCapturingStderr(reports)
    );
    const destination = (logger as any)[pino.symbols.streamSym];

    const ready = new Promise<void>((resolve) => destination.once('ready', resolve));
    // Unlike SIGUSR2, nothing gates a direct call: the second finds `reopening` true.
    destination.reopen();
    destination.reopen();
    await ready;

    expect(reports).toHaveLength(0);
    logger.info('still healthy after overlapping reopen calls');
  });

  test('the SIGUSR2 handler ignores a second reopen while one is still pending', async () => {
    const reopenSpy = vi.spyOn(SonicBoom.prototype, 'reopen');
    const { prepareSetup } = await import('../src/logger');
    const reports: string[] = [];
    const logger = await prepareSetup(
      { type: 'file', path: outputPath, format: 'json', sync: false },
      pinoCapturingStderr(reports)
    );
    const destination = (logger as any)[pino.symbols.streamSym];

    const ready = new Promise<void>((resolve) => destination.once('ready', resolve));
    process.emit('SIGUSR2', 'SIGUSR2');
    process.emit('SIGUSR2', 'SIGUSR2'); // arrives while the first reopen is still in flight
    await ready;

    expect(reopenSpy).toHaveBeenCalledTimes(1);
    expect(reports).toHaveLength(0);
  });
});
