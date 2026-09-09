import { PassThrough, Readable } from 'node:stream';
import { describe, expect, test, vi } from 'vitest';

import type { ProxyInstanceList, ProxySearchParams } from '@verdaccio/proxy';

import { SEARCH_MAX_REQUESTS, searchPages } from '../src/search-pages';

const item = (name: string) => ({ package: { name, version: '1.0.0' } });
const options = (): ProxySearchParams => ({
  url: '/-/v1/search?text=foo',
  abort: new AbortController(),
});
const uplinks = (search) => ({ npmjs: { search } }) as unknown as ProxyInstanceList;

async function consume(pages) {
  for await (const _page of pages) {
    /* exhaust */
  }
}

describe('bounded uplink pages', () => {
  test('does not suppress cancellation while awaiting the first request', async () => {
    const opts = options();
    const request = vi.fn(async () => {
      opts.abort.abort(new Error('cancelled'));
      throw new Error('request failed');
    });
    await expect(consume(searchPages(uplinks(request), opts))).rejects.toThrow('cancelled');
  });

  test('a failed source is retried on a new search, not on subsequent rounds', async () => {
    const request = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(Readable.from([[item('foo')]]));
    await consume(searchPages(uplinks(request), options()));
    const pages = searchPages(uplinks(request), options());
    const page = await pages.next();
    expect(page.value?.[0].package.name).toBe('foo');
    expect(request).toHaveBeenCalledTimes(2);
    await pages.return(undefined);
  });

  test('aborting between rounds prevents another request', async () => {
    const request = vi.fn(async () => Readable.from([[item('foo')]]));
    const opts = options();
    const pages = searchPages(uplinks(request), opts);
    await pages.next();
    opts.abort.abort(new Error('cancelled'));
    await expect(pages.next()).rejects.toThrow('cancelled');
    expect(request).toHaveBeenCalledOnce();
  });

  test('aborting while consuming a page destroys its stream', async () => {
    const stream = new PassThrough({ objectMode: true });
    const opts = options();
    const pages = searchPages(
      uplinks(async () => stream),
      opts
    );
    const pending = pages.next();
    await Promise.resolve();
    opts.abort.abort(new Error('cancelled'));
    await expect(pending).rejects.toThrow('cancelled');
    expect(stream.destroyed).toBe(true);
  });

  test('propagates stream errors instead of hanging', async () => {
    const stream = new PassThrough({ objectMode: true });
    const pages = searchPages(
      uplinks(async () => stream),
      options()
    );
    const pending = pages.next();
    await Promise.resolve();
    stream.destroy(new Error('broken stream'));
    await expect(pending).rejects.toThrow('broken stream');
  });

  test('rejects oversized pages', async () => {
    const request = async () =>
      Readable.from([Array.from({ length: 251 }, (_, i) => item(String(i)))]);
    await expect(consume(searchPages(uplinks(request), options()))).rejects.toThrow(
      'invalid uplink search page'
    );
  });

  test('limits all uplinks using one shared request budget and disables retries', async () => {
    const request = vi.fn(async (params) => {
      const offset = new URL(params.url, 'http://localhost').searchParams.get('from');
      return Readable.from([[item(`pkg-${offset}`)]]);
    });
    const sources = {
      ...uplinks(request),
      second: { search: request },
    } as unknown as ProxyInstanceList;
    await expect(consume(searchPages(sources, options()))).rejects.toThrow('budget exhausted');
    expect(request).toHaveBeenCalledTimes(SEARCH_MAX_REQUESTS);
    expect(request.mock.calls.every(([params]) => params.retry.limit === 0)).toBe(true);
  });

  test('does not interpret a missing or unknown total as an empty catalog', async () => {
    const request = vi.fn(async (params) => {
      const offset = Number(new URL(params.url, 'http://localhost').searchParams.get('from'));
      return Readable.from([offset < 2 ? [item(`pkg-${offset}`)] : []]);
    });
    await consume(searchPages(uplinks(request), options()));
    expect(request).toHaveBeenCalledTimes(3);
  });
});
