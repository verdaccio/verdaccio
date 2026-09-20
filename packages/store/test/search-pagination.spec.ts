import { describe, expect, test, vi } from 'vitest';

import type { searchUtils } from '@verdaccio/core';

import { Storage } from '../src/storage';

const item = (name: string, version = '1.0.0', description = '') =>
  ({ package: { name, version, description } }) as searchUtils.SearchPackageItem;

function setup(local: searchUtils.SearchPackageItem[], rounds: searchUtils.SearchPackageItem[][]) {
  const storage = Object.create(Storage.prototype);
  storage.getCachedPackages = vi.fn(async () => local);
  storage.searchService = {
    async *searchPages() {
      for (const round of rounds) yield round;
    },
  };
  return storage as Storage;
}
const options = () => ({
  url: '/-/v1/search?text=foo&from=20&size=20',
  abort: new AbortController(),
  query: { text: 'foo', size: 20, from: 20 } as searchUtils.SearchQuery,
});

describe('stable combined search prefixes', () => {
  test('keeps local metadata on equal versions and updates newer versions without moving names', async () => {
    const storage = setup(
      [item('a', '1.0.0', 'local'), item('b')],
      [
        [item('a', '1.0.0', 'remote'), item('c')],
        [item('a', '2.0.0', 'newer'), item('d')],
      ]
    );
    const pages = [];
    for await (const page of storage.searchPages(options())) pages.push(page);
    expect(pages.map((page) => page.map((entry) => entry.package.name))).toEqual([
      ['a', 'b', 'c'],
      ['a', 'b', 'c', 'd'],
    ]);
    expect(pages[0][0].package.description).toBe('local');
    expect(pages[1][0].package.description).toBe('newer');
    expect(storage.getCachedPackages).toHaveBeenCalledWith(expect.objectContaining({ from: 0 }));
  });

  test('counts local and remote candidates together, including duplicates', async () => {
    const storage = setup(
      Array.from({ length: 24_999 }, () => item('a')),
      [[item('b'), item('c')]]
    );
    const pages = storage.searchPages(options());
    await expect(pages.next()).rejects.toThrow('budget exhausted');
  });

  test('bounds local candidates even without any uplinks', async () => {
    const storage = setup(
      Array.from({ length: 25_001 }, () => item('a')),
      []
    );
    await expect(storage.searchPages(options()).next()).rejects.toThrow('budget exhausted');
  });

  test('stops before touching local storage when already cancelled', async () => {
    const storage = setup([], []);
    const params = options();
    params.abort.abort(new Error('cancelled'));
    await expect(storage.searchPages(params).next()).rejects.toThrow('cancelled');
    expect(storage.getCachedPackages).not.toHaveBeenCalled();
  });
});
