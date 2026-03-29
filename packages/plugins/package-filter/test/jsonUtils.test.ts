import { Range } from 'semver';
import { describe, expect, test } from 'vitest';

import { jsonLogReplacer } from '../src/utils/jsonUtils';

describe('jsonLogReplacer', () => {
  test('converts Map to plain object', () => {
    const map = new Map([
      ['foo', 'bar'],
      ['baz', 'qux'],
    ]);
    expect(jsonLogReplacer('key', map)).toEqual({ foo: 'bar', baz: 'qux' });
  });

  test('converts semver Range to its string representation', () => {
    const range = new Range('>=1.0.0 <2.0.0');
    expect(jsonLogReplacer('key', range)).toBe(range.range);
  });

  test('passes through primitive values unchanged', () => {
    expect(jsonLogReplacer('key', 'hello')).toBe('hello');
    expect(jsonLogReplacer('key', 42)).toBe(42);
    expect(jsonLogReplacer('key', true)).toBe(true);
    expect(jsonLogReplacer('key', null)).toBe(null);
  });

  test('passes through plain objects unchanged', () => {
    const obj = { a: 1, b: 2 };
    expect(jsonLogReplacer('key', obj)).toBe(obj);
  });

  test('works with JSON.stringify', () => {
    const data = {
      rules: new Map([['@scope', 'scope']]),
      range: new Range('>1.0.0'),
      name: 'test',
    };
    const result = JSON.parse(JSON.stringify(data, jsonLogReplacer));
    expect(result.rules).toEqual({ '@scope': 'scope' });
    expect(typeof result.range).toBe('string');
    expect(result.name).toBe('test');
  });
});
