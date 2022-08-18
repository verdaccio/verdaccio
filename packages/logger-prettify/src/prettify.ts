import { isColorSupported } from 'colorette';
import { WriteStream } from 'fs';
import build from 'pino-abstract-transport';
import SonicBoom, { SonicBoomOpts } from 'sonic-boom';
import { Transform, pipeline } from 'stream';
import { isMainThread } from 'worker_threads';

import { fillInMsgTemplate, printMessage } from './formatter';
import { PrettyOptionsExtended } from './types';

export { fillInMsgTemplate };

function noop() {}

/**
 * Creates a safe SonicBoom instance
 *
 * @param {object} opts Options for SonicBoom
 *
 * @returns {object} A new SonicBoom stream
 */
function buildSafeSonicBoom(opts: SonicBoomOpts) {
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

function setupOnExit(stream) {
  /* istanbul ignore next */
  if (global.WeakRef && global.WeakMap && global.FinalizationRegistry) {
    // This is leak free, it does not leave event handlers
    const onExit = require('on-exit-leak-free');

    onExit.register(stream, autoEnd);

    stream.on('close', function () {
      onExit.unregister(stream);
    });
  }
}

/* istanbul ignore next */
function autoEnd(stream, eventName) {
  // This check is needed only on some platforms

  if (stream.destroyed) {
    return;
  }

  if (eventName === 'beforeExit') {
    // We still have an event loop, let's use it
    stream.flush();
    stream.on('drain', function () {
      stream.end();
    });
  } else {
    // We do not have an event loop, so flush synchronously
    stream.flushSync();
  }
}

export function hasColors(colors: boolean | undefined) {
  if (colors) {
    return isColorSupported;
  }
  return typeof colors === 'undefined' ? true : colors;
}

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
      sync: opts.sync || true,
    }) as unknown as WriteStream;

    source.on('unknown', function (line) {
      destination.write(line + '\n');
    });

    pipeline(source, stream, destination, (err) => {
      // eslint-disable-next-line no-console
      console.error('prettify pipeline error ', err);
    });
    return stream;
  });
}
