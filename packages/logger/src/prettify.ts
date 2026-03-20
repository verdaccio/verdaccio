import type { WriteStream } from 'node:fs';
import { Transform, pipeline } from 'node:stream';
import { isMainThread } from 'node:worker_threads';
import build from 'pino-abstract-transport';
import type { SonicBoomOpts } from 'sonic-boom';
import SonicBoom from 'sonic-boom';

import { hasColors } from './colors';
import { fillInMsgTemplate, printMessage } from './formatter';
import type { PrettyOptionsExtended } from './types';

export { fillInMsgTemplate };

function noop() {}

/**
 * Creates a safe SonicBoom instance
 *
 * @param {object} opts Options for SonicBoom
 *
 * @returns {object} A new SonicBoom stream
 */
export function buildSafeSonicBoom(opts: SonicBoomOpts) {
  const stream = new SonicBoom(opts);
  stream.on('error', filterBrokenPipe);
  if (!opts.sync && isMainThread) {
    setupOnExit(stream);
  }
  return stream;

  function filterBrokenPipe(err) {
    if (err.code === 'EPIPE') {
      // @ts-ignore
      stream.write = noop;
      stream.end = noop;
      stream.flushSync = noop;
      stream.destroy = noop;
      return;
    }
    stream.removeListener('error', filterBrokenPipe);
  }
}

export function autoEnd(stream: SonicBoom & { destroyed?: boolean }, eventName: string) {
  if (stream.destroyed) {
    return;
  }

  if (eventName === 'beforeExit') {
    stream.flush();
    stream.on('drain', function () {
      stream.end();
    });
  } else {
    // Guard against SonicBoom not being ready (file not yet opened)
    // to prevent "sonic boom is not ready yet" crash on early process exit
    try {
      stream.flushSync();
    } catch (err: unknown) {
      if (err instanceof Error && err.message?.includes('not ready')) {
        // Stream not ready, nothing to flush
        return;
      }
      // Re-throw real I/O errors (disk full, permission denied, etc.)
      throw err;
    }
  }
}

function setupOnExit(stream) {
  // WeakRef/FinalizationRegistry are guaranteed available in Node 20+ (pino v10 minimum)
  const onExit = require('on-exit-leak-free');
  onExit.register(stream, autoEnd);
  stream.on('close', function () {
    onExit.unregister(stream);
  });
}

export { hasColors } from './colors';

export function buildPretty(opts: PrettyOptionsExtended) {
  return (chunk) => {
    const colors = hasColors(opts.colors);
    return printMessage(chunk, { prettyStamp: opts.prettyStamp }, colors);
  };
}

export default function (opts) {
  const pretty = buildPretty(opts);
  // @ts-ignore
  return build(function (source) {
    const stream = new Transform({
      objectMode: true,
      autoDestroy: true,
      transform(chunk, enc, cb) {
        const line = pretty(chunk) + '\n';
        cb(null, line);
      },
    });
    const destination = buildSafeSonicBoom({
      dest: opts.destination || 1,
      // Defaults to async (false). The transport runs in a worker thread,
      // so sync only blocks the worker, not the main thread.
      // Can be set to true via config for deterministic log ordering (like console.log).
      sync: opts.sync ?? false,
    }) as unknown as WriteStream;

    source.on('unknown', function (line) {
      destination.write(line + '\n');
    });

    pipeline(source, stream, destination, (err) => {
      if (err) {
        console.error('prettify pipeline error ', err);
      }
    });
    return stream;
  });
}
