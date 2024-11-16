import { describe, expect, test } from 'vitest';

import { validatePublishSingleVersion } from '../src/schemes/publish-manifest';

describe('validatePublishSingleVersion', () => {
  describe('valid cases', () => {
    test('should validate a manifest when name and versions are present, even with extra properties', () => {
      const manifest = {
        name: 'foo-pkg',
        _attachments: { '2': {} },
        versions: { '1': {} },
        something: 'else',
      };
      expect(validatePublishSingleVersion(manifest)).toBe(true);
    });
  });

  describe('invalid cases', () => {
    test('should invalidate a manifest when name is missing', () => {
      const manifest = {
        _attachments: { '2': {} },
        versions: { '1': {} },
      };
      expect(validatePublishSingleVersion(manifest)).toBe(false);
    });

    test('should invalidate a manifest when _attachments is missing', () => {
      const manifest = {
        name: 'foo-pkg',
        versions: { '1': {} },
      };
      expect(validatePublishSingleVersion(manifest)).toBe(false);
    });

    test('should invalidate a manifest when versions is missing', () => {
      const manifest = {
        name: 'foo-pkg',
        _attachments: { '1': {} },
      };
      expect(validatePublishSingleVersion(manifest)).toBe(false);
    });

    test('should invalidate a manifest when versions contains more than one entry', () => {
      const manifest = {
        name: 'foo-pkg',
        versions: { '1': {}, '2': {} },
        _attachments: { '1': {} },
      };
      expect(validatePublishSingleVersion(manifest)).toBe(false);
    });

    test('should invalidate a manifest when _attachments contains more than one entry', () => {
      const manifest = {
        name: 'foo-pkg',
        _attachments: { '1': {}, '2': {} },
        versions: { '1': {} },
      };
      expect(validatePublishSingleVersion(manifest)).toBe(false);
    });
  });
});
