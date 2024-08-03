import { describe, expect, test } from 'vitest';

import { getUserAgent } from '../src';

describe('getUserAgent', () => {
  test('should return custom user agent when customUserAgent is true', () => {
    const customUserAgent = true;
    const version = '1.0.0';
    const name = 'MyAgent';

    const result = getUserAgent(customUserAgent, version, name);

    expect(result).toBe('MyAgent/1.0.0');
  });

  test('should return custom user agent when customUserAgent is a non-empty string', () => {
    const customUserAgent = 'CustomAgent/1.0.0';
    const version = '1.0.0';
    const name = 'MyAgent';

    const result = getUserAgent(customUserAgent, version, name);

    expect(result).toBe('CustomAgent/1.0.0');
  });

  test('should return "hidden" when customUserAgent is false', () => {
    const customUserAgent = false;
    const version = '1.0.0';
    const name = 'MyAgent';

    const result = getUserAgent(customUserAgent, version, name);

    expect(result).toBe('hidden');
  });

  test('should return default user agent when customUserAgent is undefined', () => {
    const version = '1.0.0';
    const name = 'MyAgent';

    const result = getUserAgent(undefined, version, name);

    expect(result).toBe('MyAgent/1.0.0');
  });
});
