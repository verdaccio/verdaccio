import { EventEmitter } from 'node:events';
import { describe, expect, test, vi } from 'vitest';

import { abortOnResponseClose } from '../../src/abort-on-response-close';

function response(writableFinished = false) {
  return Object.assign(new EventEmitter(), { writableFinished });
}

describe('abortOnResponseClose', () => {
  test('aborts the controller and destroys the stream when the client disconnects', () => {
    const abort = new AbortController();
    const stream = { destroy: vi.fn() };
    const onDisconnect = vi.fn();
    const res = response(false);

    abortOnResponseClose(res, abort, stream, onDisconnect);
    res.emit('close');

    expect(onDisconnect).toHaveBeenCalledOnce();
    expect(abort.signal.aborted).toBe(true);
    expect(stream.destroy).toHaveBeenCalledOnce();
  });

  test('ignores a clean response close', () => {
    const abort = new AbortController();
    const stream = { destroy: vi.fn() };
    const res = response(true);

    abortOnResponseClose(res, abort, stream);
    res.emit('close');

    expect(abort.signal.aborted).toBe(false);
    expect(stream.destroy).not.toHaveBeenCalled();
  });

  test('is a no-op when the signal is already aborted', () => {
    const abort = new AbortController();
    abort.abort();
    const stream = { destroy: vi.fn() };
    const res = response(false);

    abortOnResponseClose(res, abort, stream);
    res.emit('close');

    expect(stream.destroy).not.toHaveBeenCalled();
  });
});
