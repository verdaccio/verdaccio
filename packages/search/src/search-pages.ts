import { errorUtils } from '@verdaccio/core';
import type { searchUtils } from '@verdaccio/core';
import type { ProxyInstanceList, ProxySearchParams } from '@verdaccio/proxy';

export const SEARCH_PAGE_SIZE = 250;
export const SEARCH_MAX_REQUESTS = 100;
export const SEARCH_MAX_CANDIDATES = 25_000;

/** Read one page per uplink per round, in configuration order, never arrival order. */
export async function* searchPages(
  uplinks: ProxyInstanceList,
  options: ProxySearchParams
): AsyncGenerator<searchUtils.SearchPackageItem[]> {
  const states = Object.values(uplinks).map((uplink) => ({
    uplink,
    offset: 0,
    done: false,
    seen: new Set<string>(),
  }));
  let requests = 0;
  let candidates = 0;
  while (states.some((state) => !state.done)) {
    const round: searchUtils.SearchPackageItem[] = [];
    for (const state of states) {
      options.abort.signal.throwIfAborted();
      if (state.done) continue;
      if (requests >= SEARCH_MAX_REQUESTS || candidates >= SEARCH_MAX_CANDIDATES) {
        throw errorUtils.getServiceUnavailable('search pagination budget exhausted');
      }
      const url = new URL(options.url, 'http://localhost');
      url.searchParams.set('from', String(state.offset));
      url.searchParams.set('size', String(SEARCH_PAGE_SIZE));
      let total: number | undefined;
      requests++;
      // Retries would bypass the request budget; the caller can retry the search.
      let stream;
      try {
        stream = await state.uplink.search({
          ...options,
          url: `${url.pathname}${url.search}`,
          retry: { limit: 0 },
          onSearchPage: (value) => {
            total = value;
          },
        });
      } catch (error) {
        options.abort.signal.throwIfAborted();
        // Preserve best-effort search for an unavailable source. Once a source
        // has contributed results, losing its next page must not look like EOF.
        if (state.offset > 0) throw error;
        state.done = true;
        continue;
      }
      const onAbort = () => stream.destroy(options.abort.signal.reason);
      options.abort.signal.addEventListener('abort', onAbort, { once: true });
      const page: searchUtils.SearchPackageItem[] = [];
      try {
        options.abort.signal.throwIfAborted();
        for await (const chunk of stream) {
          options.abort.signal.throwIfAborted();
          if (!Array.isArray(chunk) || page.length + chunk.length > SEARCH_PAGE_SIZE) {
            throw errorUtils.getServiceUnavailable('invalid uplink search page');
          }
          page.push(...chunk);
        }
      } finally {
        options.abort.signal.removeEventListener('abort', onAbort);
        stream.destroy();
      }
      candidates += page.length;
      if (candidates > SEARCH_MAX_CANDIDATES) {
        throw errorUtils.getServiceUnavailable('search pagination budget exhausted');
      }
      let progress = false;
      for (const item of page) {
        if (typeof item?.package?.name !== 'string' || typeof item.package.version !== 'string') {
          throw errorUtils.getServiceUnavailable('invalid uplink search package');
        }
        const key = JSON.stringify([item.package.name, item.package.version]);
        if (!state.seen.has(key)) progress = true;
        state.seen.add(key);
        round.push({ ...item, verdaccioPkgCached: false, verdaccioPrivate: false });
      }
      if (page.length > 0 && !progress) {
        throw errorUtils.getServiceUnavailable('uplink search pagination did not advance');
      }
      state.offset += page.length;
      // A short page can be an uplink's smaller cap. Only a reported total or an
      // empty page proves exhaustion; otherwise request the next offset.
      state.done = page.length === 0 || (total !== undefined && state.offset >= total);
    }
    yield round;
  }
}
