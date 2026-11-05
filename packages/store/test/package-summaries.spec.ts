import MockDate from 'mockdate';
import { afterEach, describe, expect, test } from 'vitest';

import {
  PackageSummaryCache,
  SUMMARY_KEYWORDS_MAX,
  SUMMARY_TEXT_MAX,
  indexAfter,
  toPackageSummary,
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

  test('should refuse a set older than a write or removal of the entry', () => {
    const cache = new PackageSummaryCache(10, 60_000);
    const old = { ...summary('a'), version: '1.0.0' };
    const fresh = { ...summary('a'), version: '2.0.0' };

    const beforeWrite = cache.generation('a');
    cache.set('a', fresh);
    expect(cache.set('a', old, beforeWrite)).toBe(false);
    expect(cache.get('a')).toEqual(fresh);

    const beforeDelete = cache.generation('a');
    cache.delete('a');
    expect(cache.set('a', old, beforeDelete)).toBe(false);
    expect(cache.get('a')).toBeUndefined();

    expect(cache.set('a', fresh, cache.generation('a'))).toBe(true);
    expect(cache.get('a')).toEqual(fresh);
  });

  test('should keep refusing stale sets once the write history is trimmed', () => {
    const cache = new PackageSummaryCache(2, 60_000);
    const beforeWrite = cache.generation('a');
    cache.set('a', summary('a'));
    // two more names push the history past its capacity
    cache.set('b', summary('b'));
    cache.set('c', summary('c'));

    expect(cache.set('a', { ...summary('a'), version: '0.0.1' }, beforeWrite)).toBe(false);
    expect(cache.set('z', summary('z'), cache.generation('z'))).toBe(true);
  });
});

describe('toPackageSummary', () => {
  const version = (fields: Record<string, unknown>) =>
    ({ name: 'foo', version: '1.0.0', dist: { tarball: 'http://x/foo.tgz' }, ...fields }) as any;

  test('should bound the text fields taken from the manifest', () => {
    const long = 'x'.repeat(SUMMARY_TEXT_MAX * 3);
    const result = toPackageSummary(
      version({
        description: long,
        homepage: long,
        license: long,
        keywords: Array.from({ length: SUMMARY_KEYWORDS_MAX * 2 }, () => long),
        author: { name: long, email: long, url: long, extra: long },
        bugs: { url: long, email: long },
      })
    );

    expect(result.description).toHaveLength(SUMMARY_TEXT_MAX);
    expect(result.homepage).toHaveLength(SUMMARY_TEXT_MAX);
    expect(result.license).toHaveLength(SUMMARY_TEXT_MAX);
    expect(result.keywords).toHaveLength(SUMMARY_KEYWORDS_MAX);
    expect(result.keywords?.[0]).toHaveLength(SUMMARY_TEXT_MAX);
    expect(result.author).toEqual({
      name: 'x'.repeat(SUMMARY_TEXT_MAX),
      email: 'x'.repeat(SUMMARY_TEXT_MAX),
      url: 'x'.repeat(SUMMARY_TEXT_MAX),
    });
    expect(result.bugs).toEqual({
      url: 'x'.repeat(SUMMARY_TEXT_MAX),
      email: 'x'.repeat(SUMMARY_TEXT_MAX),
    });
  });

  test('should keep short fields, string authors and object licenses as they are', () => {
    const result = toPackageSummary(
      version({
        description: 'short',
        keywords: ['a', 'b'],
        author: 'Jane <jane@example.org>',
        license: { type: 'MIT', url: 'http://x/LICENSE' },
        bugs: 'http://x/issues',
      })
    );

    expect(result).toEqual(
      expect.objectContaining({
        description: 'short',
        keywords: ['a', 'b'],
        author: 'Jane <jane@example.org>',
        license: { type: 'MIT', url: 'http://x/LICENSE' },
        bugs: 'http://x/issues',
        dist: { tarball: 'http://x/foo.tgz', unpackedSize: undefined },
      })
    );
  });

  test('should drop fields of an unexpected shape', () => {
    const result = toPackageSummary(version({ description: 42, keywords: 'a, b', author: 7 }));

    expect(result.description).toBeUndefined();
    expect(result.keywords).toBeUndefined();
    expect(result.author).toBeUndefined();
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
