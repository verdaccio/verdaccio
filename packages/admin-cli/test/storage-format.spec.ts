import { describe, expect, test } from 'vitest';

import { formatBytes } from '../src/commands/storage/format';

describe('formatBytes', () => {
  test.each([
    [0, '0 B'],
    [512, '512 B'],
    [1024, '1.0 KB'],
    [1536, '1.5 KB'],
    [1048576, '1.0 MB'],
    [1073741824, '1.0 GB'],
  ])('%d -> %s', (bytes, expected) => {
    expect(formatBytes(bytes)).toBe(expected);
  });
});
