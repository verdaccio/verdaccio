import { describe, expect, test } from 'vitest';

import {
  addNewVersion,
  generateLocalPackageMetadata,
  generatePackageMetadata,
  generateRemotePackageMetadata,
} from '../src';

describe('generate metadata', () => {
  describe('generatePackageMetadata', () => {
    test('should generate package metadata', () => {
      expect(generatePackageMetadata('foo', '1.0.0')).toBeDefined();
    });

    test('should match versions', () => {
      const manifest = generatePackageMetadata('foo', '1.0.0');
      expect(Object.keys(manifest.versions)).toEqual(['1.0.0']);
    });

    test('should add new versions', () => {
      const manifest = generatePackageMetadata('foo', '1.0.0');
      const m1 = addNewVersion(manifest, '1.0.1');
      expect(Object.keys(m1.versions)).toEqual(['1.0.0', '1.0.1']);
      const m = addNewVersion(m1, '1.0.2');
      expect(Object.keys(m.versions)).toEqual(['1.0.0', '1.0.1', '1.0.2']);
      expect(m['dist-tags'].latest).toEqual('1.0.2');
      expect(m._distfiles['foo-1.0.2.tgz']).toEqual({
        sha: '2c03764f651a9f016ca0b7620421457b619151b9',
        url: 'http://localhost:5555/foo/-/foo-1.0.2.tgz',
      });
    });

    test('should fails add repeated version', () => {
      const manifest = generatePackageMetadata('foo', '1.0.0');
      expect(() => Object.keys(addNewVersion(manifest, '1.0.0').versions)).toThrow();
    });
  });
  describe('generateRemotePackageMetadata', () => {
    test('should generate package metadata', () => {
      expect(
        generateRemotePackageMetadata('foo', '1.0.0', 'https://registry.verdaccio.org')
      ).toBeDefined();
    });

    test('should generate package metadata with multiple versions', () => {
      const m = generateRemotePackageMetadata('foo', '1.0.0', 'https://registry.verdaccio.org', [
        '1.0.1',
        '1.0.2',
        '3.0.0',
      ]);
      expect(m).toBeDefined();
      expect(Object.keys(m.versions)).toEqual(['1.0.0', '1.0.1', '1.0.2', '3.0.0']);
      expect(Object.keys(m.time)).toEqual([
        'modified',
        'created',
        '1.0.0',
        '1.0.1',
        '1.0.2',
        '3.0.0',
      ]);
    });
  });
  describe('generateLocalPackageMetadata', () => {
    test('should generate local package metadata', () => {
      const m = generateLocalPackageMetadata('foo', '1.0.0', 'https://registry.verdaccio.org');
      expect(m).toBeDefined();
      expect(m._attachments['foo-1.0.0.tgz']).toEqual({
        shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
        version: '1.0.0',
      });
      expect(m._distfiles).toEqual({});
    });

    test('should add new versions local', () => {
      const manifest = generateLocalPackageMetadata('foo', '1.0.0');
      const m1 = addNewVersion(manifest, '1.0.1', false);
      expect(Object.keys(m1._attachments)).toEqual(['foo-1.0.0.tgz', 'foo-1.0.1.tgz']);
      expect(Object.keys(m1._distfiles)).toEqual([]);
      const m2 = addNewVersion(m1, '1.0.2', false);
      expect(Object.keys(m2.versions)).toEqual(['1.0.0', '1.0.1', '1.0.2']);
      expect(m2['dist-tags'].latest).toEqual('1.0.2');
      expect(m2._distfiles).toEqual({});
      expect(m2._attachments).toEqual({
        'foo-1.0.0.tgz': {
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
          version: '1.0.0',
        },
        'foo-1.0.1.tgz': {
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
          version: '1.0.1',
        },
        'foo-1.0.2.tgz': {
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
          version: '1.0.2',
        },
      });
      const m3 = addNewVersion(m2, '1.0.3', false);
      expect(m3._attachments).toEqual({
        'foo-1.0.0.tgz': {
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
          version: '1.0.0',
        },
        'foo-1.0.1.tgz': {
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
          version: '1.0.1',
        },
        'foo-1.0.2.tgz': {
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
          version: '1.0.2',
        },
        'foo-1.0.3.tgz': {
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
          version: '1.0.3',
        },
      });
    });
  });
});
