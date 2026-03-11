import { describe, expect, it } from 'vitest';

import { getTarball } from '../src/utils';

describe('getTarball', () => {
  it('should return the name when there is no "/" in the input string', () => {
    const input = 'simple-name';
    const result = getTarball(input);

    expect(result).toBe('simple-name');
  });

  it('should return the second part of the name when there is a "/" in the input string', () => {
    const input = 'scope/package-name';
    const result = getTarball(input);

    expect(result).toBe('package-name');
  });
});
