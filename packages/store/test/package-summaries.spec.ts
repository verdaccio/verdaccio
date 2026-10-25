import MockDate from 'mockdate';
import { afterEach, describe, expect, test } from 'vitest';

import {
  PackageSummaryCache,
  indexAfter,
  withName,
  withoutName,
} from '../src/lib/package-summaries';

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

describe('sorted names', () => {
  const names = ['@scope/a', 'b', 'd'];

  test('indexAfter should point past the last entry not greater than the name', () => {
    expect(indexAfter(names, '@scope/a')).toBe(1);
    expect(indexAfter(names, 'c')).toBe(2);
    expect(indexAfter(names, 'z')).toBe(3);
    expect(indexAfter([], 'a')).toBe(0);
  });

  test('withName should insert in order and keep the list when present', () => {
    expect(withName(names, 'c')).toEqual(['@scope/a', 'b', 'c', 'd']);
    expect(withName(names, '0')).toEqual(['0', '@scope/a', 'b', 'd']);
    expect(withName(names, 'b')).toBe(names);
  });

  test('withoutName should remove the name and keep the list when absent', () => {
    expect(withoutName(names, 'b')).toEqual(['@scope/a', 'd']);
    expect(withoutName(names, 'd')).toEqual(['@scope/a', 'b']);
    expect(withoutName(names, 'c')).toBe(names);
  });
});
