import { describe, expect, test } from 'vitest';

import { parseConfig } from '../src/config/parser';

describe('parseConfig', () => {
  test('returns empty rules when config is empty', () => {
    const result = parseConfig({});
    expect(result.blockRules.size).toBe(0);
    expect(result.allowRules.size).toBe(0);
    expect(result.dateThreshold).toBeNull();
    expect(result.minAgeMs).toBeNull();
  });

  test('parses scope block rule', () => {
    const result = parseConfig({ block: [{ scope: '@evil' }] });
    expect(result.blockRules.get('@evil')).toBe('scope');
  });

  test('parses package block rule', () => {
    const result = parseConfig({ block: [{ package: 'malicious-pkg' }] });
    expect(result.blockRules.get('malicious-pkg')).toBe('package');
  });

  test('parses version block rule', () => {
    const result = parseConfig({ block: [{ package: 'foo', versions: '>=1.0.0' }] });
    const rule = result.blockRules.get('foo');
    expect(rule).toBeDefined();
    expect(typeof rule).toBe('object');
  });

  test('merges multiple version rules for the same package', () => {
    const result = parseConfig({
      block: [
        { package: 'foo', versions: '>=2.0.0' },
        { package: 'foo', versions: '<1.0.0' },
      ],
    });
    const rule = result.blockRules.get('foo');
    expect(typeof rule).toBe('object');
    if (typeof rule === 'object' && rule !== null && 'versions' in rule) {
      expect(rule.versions).toHaveLength(2);
    }
  });

  test('parses dateThreshold', () => {
    const result = parseConfig({ dateThreshold: '2024-01-01' });
    expect(result.dateThreshold).toBeInstanceOf(Date);
    expect(result.dateThreshold!.getFullYear()).toBe(2024);
  });

  test('parses minAgeDays', () => {
    const result = parseConfig({ minAgeDays: 30 });
    expect(result.minAgeMs).toBe(30 * 24 * 60 * 60 * 1000);
  });

  describe('error handling', () => {
    test('throws when scope does not start with @', () => {
      expect(() => parseConfig({ block: [{ scope: 'noscope' }] })).toThrow(
        'Scope value must start with @'
      );
    });

    test('throws when package already has a strict rule and version rule is added', () => {
      expect(() =>
        parseConfig({
          block: [{ package: 'foo' }, { package: 'foo', versions: '>=1.0.0' }],
        })
      ).toThrow('already specified by another strict rule');
    });

    test('throws on unparseable rule', () => {
      expect(() => parseConfig({ block: [{} as any] })).toThrow('Could not parse rule');
    });

    test('throws on invalid dateThreshold', () => {
      expect(() => parseConfig({ dateThreshold: 'not-a-date' })).toThrow('Invalid date');
    });

    test('throws on negative minAgeDays', () => {
      expect(() => parseConfig({ minAgeDays: -5 })).toThrow('Invalid number');
    });

    test('handles NaN minAgeDays as no filter', () => {
      const result = parseConfig({ minAgeDays: NaN });
      expect(result.minAgeMs).toBeNull();
    });
  });
});
