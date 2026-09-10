import { EventEmitter } from 'node:events';
import { afterEach, describe, expect, test, vi } from 'vitest';

import search from '../../src/v1/search';

function harness(storage, allowAccess = (_pkg, _user, cb) => cb(null, true)) {
  const route = { get: vi.fn() };
  const logger = { debug: vi.fn(), error: vi.fn() };
  search(route, { allow_access: allowAccess } as never, storage, {} as never, logger as never);
  const handler = route.get.mock.calls[0].at(-1);
  const req = {
    query: { text: 'foo', from: 0, size: 2 },
    url: '/-/v1/search?text=foo',
    remote_user: {},
  };
  const res = Object.assign(new EventEmitter(), {
    writableEnded: false,
    destroyed: false,
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  });
  const next = vi.fn();
  return { req, res, next, run: () => handler(req, res, next) };
}

afterEach(() => vi.useRealTimers());

describe('search pagination lifecycle', () => {
  test('cancels upstream work when the response connection closes', async () => {
    let signal: AbortSignal | undefined;
    let stopped = false;
    const storage = {
      async *searchPages(options) {
        signal = options.abort.signal;
        try {
          await new Promise((_resolve, reject) =>
            signal!.addEventListener('abort', () => reject(signal!.reason), { once: true })
          );
          yield [];
        } finally {
          stopped = true;
        }
      },
    };
    const h = harness(storage);
    const running = h.run();
    h.res.destroyed = true;
    h.res.emit('close');
    await running;
    expect(signal?.aborted).toBe(true);
    expect(stopped).toBe(true);
    expect(h.next).not.toHaveBeenCalled();
    expect(h.res.json).not.toHaveBeenCalled();
    expect(h.res.listenerCount('close')).toBe(0);
  });

  test('the total deadline also interrupts a stalled authorization plugin', async () => {
    vi.useFakeTimers();
    let signal: AbortSignal | undefined;
    let rounds = 0;
    const storage = {
      async *searchPages(options) {
        signal = options.abort.signal;
        rounds++;
        yield [{ package: { name: 'foo', version: '1.0.0' } }];
        rounds++;
        yield [];
      },
    };
    const authorize = vi.fn();
    const h = harness(storage, authorize);
    const timers = vi.getTimerCount();
    const running = h.run();
    await vi.advanceTimersByTimeAsync(30_000);
    await running;
    expect(authorize).toHaveBeenCalledOnce();
    expect(signal?.aborted).toBe(true);
    expect(h.next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 503, message: 'search pagination timed out' })
    );
    expect(rounds).toBe(1);
    expect(vi.getTimerCount()).toBe(timers);
  });

  test('normal completion removes timers and listeners', async () => {
    vi.useFakeTimers();
    const storage = {
      async *searchPages() {
        yield [];
      },
    };
    const h = harness(storage);
    const timers = vi.getTimerCount();
    await h.run();
    expect(h.res.status).toHaveBeenCalledWith(200);
    expect(h.next).not.toHaveBeenCalled();
    expect(h.res.listenerCount('close')).toBe(0);
    expect(vi.getTimerCount()).toBe(timers);
  });
});
