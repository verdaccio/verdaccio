import { describe, expect, test } from 'vitest';

import { MIN_NODE_VERSION, isVersionValid } from '../../../../src/lib/cli/utils';

describe('CLI utils', () => {
  describe('MIN_NODE_VERSION', () => {
    test('should be 18', () => {
      expect(MIN_NODE_VERSION).toBe('18');
    });
  });

  describe('isVersionValid', () => {
    test('should return true for Node 18.x', () => {
      expect(isVersionValid('v18.0.0')).toBe(true);
      expect(isVersionValid('v18.19.1')).toBe(true);
    });

    test('should return true for Node 20.x', () => {
      expect(isVersionValid('v20.0.0')).toBe(true);
      expect(isVersionValid('v20.11.0')).toBe(true);
    });

    test('should return true for Node 22.x and above', () => {
      expect(isVersionValid('v22.0.0')).toBe(true);
      expect(isVersionValid('v24.0.0')).toBe(true);
    });

    test('should return false for Node 16.x and below', () => {
      expect(isVersionValid('v16.20.0')).toBe(false);
      expect(isVersionValid('v14.21.0')).toBe(false);
      expect(isVersionValid('v12.22.0')).toBe(false);
    });

    test('should return false for Node 17.x', () => {
      expect(isVersionValid('v17.9.0')).toBe(false);
    });
  });
});
