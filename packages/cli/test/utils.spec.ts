import { describe, expect, test } from 'vitest';

import { isVersionValid } from '../src/utils';

describe('utils', () => {
  test('valid version node.js', () => {
    expect(isVersionValid('v24.0.0')).toBeTruthy();
    expect(isVersionValid('v25.0.0')).toBeTruthy();
    expect(isVersionValid('v26.0.0')).toBeTruthy();
  });

  test('is invalid version node.js', () => {
    expect(isVersionValid('v23.0.0')).toBeFalsy();
    expect(isVersionValid('v22.0.0')).toBeFalsy();
    expect(isVersionValid('v18.0.0')).toBeFalsy();
    expect(isVersionValid('v16.0.0')).toBeFalsy();
    expect(isVersionValid('v0.0.10')).toBeFalsy();
  });
});
