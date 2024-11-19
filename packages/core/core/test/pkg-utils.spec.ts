import { describe, expect, test } from 'vitest';

import { DIST_TAGS, pkgUtils } from '../src';

describe('pkg-utils', () => {
  test('getLatest fails if no versions', () => {
    expect(() =>
      // @ts-expect-error
      pkgUtils.getLatest({
        versions: {},
      })
    ).toThrow('cannot get lastest version of none');
  });

  test('getLatest get latest', () => {
    expect(
      pkgUtils.getLatest({
        versions: {
          // @ts-expect-error
          '1.0.0': {},
        },
        [DIST_TAGS]: {
          latest: '1.0.0',
        },
      })
    ).toBe('1.0.0');
  });
});
