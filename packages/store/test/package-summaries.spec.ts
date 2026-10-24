import MockDate from 'mockdate';
import { afterEach, describe, expect, test } from 'vitest';

import { PackageSummaryCache } from '../src/lib/package-summaries';

const summary = (name: string) => ({ name, version: '1.0.0' });

describe('PackageSummaryCache', () => {
  afterEach(() => {
    MockDate.reset();
  });

  test('should evict the least recently used entry over capacity', () => {
    const cache = new PackageSummaryCache(2, 60_000);
    cache.set('a', summary('a'));
    cache.set('b', summary('b'));
    cache.get('a');
    cache.set('c', summary('c'));

    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toEqual(summary('a'));
    expect(cache.get('c')).toEqual(summary('c'));
  });

  test('should expire entries after the ttl', () => {
    const cache = new PackageSummaryCache(10, 1_000);
    cache.set('a', summary('a'));
    MockDate.set(Date.now() + 1_000);

    expect(cache.get('a')).toBeUndefined();
    expect(cache.size).toBe(0);
  });
});
