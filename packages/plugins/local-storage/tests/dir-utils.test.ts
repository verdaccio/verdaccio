import { join } from 'path';
import { describe, expect, test } from 'vitest';

import { getFolders, searchOnStorage } from '../src/dir-utils';

const mockFolder = join(__dirname, 'mockStorage');

const pathStorage1 = join(mockFolder, 'storage1');
const pathStorage2 = join(mockFolder, 'storage2');
const storages = new Map<string, string>();
storages.set('storage1', pathStorage1);
storages.set('storage2', pathStorage2);

test('getFolders storage 1', async () => {
  const files = await getFolders(join(pathStorage1, '@bar'));
  expect(files).toHaveLength(2);
  expect(files).toEqual(['pkg1', 'pkg2']);
});

test('getFolders storage 2', async () => {
  const files = await getFolders(pathStorage2);
  expect(files).toHaveLength(1);
  expect(files).toEqual(['pkg4']);
});

test('getFolders storage 2 with pattern', async () => {
  const files = await getFolders(pathStorage1, '*bar*');
  expect(files).toHaveLength(1);
  expect(files).toEqual(['@bar']);
});

describe('searchOnFolders', () => {
  test('should find results', async () => {
    const packages = await searchOnStorage(mockFolder, storages);
    expect(packages).toHaveLength(9);
    expect(packages).toEqual([
      {
        name: '@foo/pkg1',
        scoped: '@foo',
      },
      {
        name: '@foo/pkg2',
        scoped: '@foo',
      },
      { name: 'dont-include' },
      {
        name: 'pkg1',
      },
      {
        name: 'pkg2',
      },
      {
        name: 'pkg3',
      },
      {
        name: '@bar/pkg1',
        scoped: '@bar',
      },
      {
        name: '@bar/pkg2',
        scoped: '@bar',
      },
      {
        name: 'pkg4',
      },
    ]);
  });
});
