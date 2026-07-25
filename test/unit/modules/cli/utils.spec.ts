import { describe, expect, test } from 'vitest';

import {
  MIN_NODE_VERSION,
  RECOMMENDED_NODE_VERSION,
  isVersionRecommended,
  isVersionValid,
} from '../../../../src/lib/cli/utils';

describe('CLI utils', () => {
  describe('MIN_NODE_VERSION', () => {
    test('should be 22', () => {
      expect(MIN_NODE_VERSION).toBe('22');
    });
  });

  describe('isVersionValid', () => {
    test('should return true for Node 22.x and above', () => {
      expect(isVersionValid('v22.0.0')).toBe(true);
      expect(isVersionValid('v24.0.0')).toBe(true);
      expect(isVersionValid('v26.0.0')).toBe(true);
    });

    test('should return false for Node 20.x and below', () => {
      expect(isVersionValid('v20.19.0')).toBe(false);
      expect(isVersionValid('v18.19.1')).toBe(false);
      expect(isVersionValid('v16.20.0')).toBe(false);
    });

    test('should return false for Node 21.x', () => {
      expect(isVersionValid('v21.7.0')).toBe(false);
    });
  });

  describe('RECOMMENDED_NODE_VERSION', () => {
    test('should be 24', () => {
      expect(RECOMMENDED_NODE_VERSION).toBe('24');
    });
  });

  describe('isVersionRecommended', () => {
    test('should return true for Node 24.x and above', () => {
      expect(isVersionRecommended('v24.0.0')).toBe(true);
      expect(isVersionRecommended('v26.0.0')).toBe(true);
    });

    test('should return false for Node below 24.x', () => {
      expect(isVersionRecommended('v20.11.0')).toBe(false);
      expect(isVersionRecommended('v22.0.0')).toBe(false);
      expect(isVersionRecommended('v23.11.0')).toBe(false);
    });
  });
});
