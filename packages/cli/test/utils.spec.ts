import { describe, expect, test } from 'vitest';

import { isVersionValid } from '../src/utils';

describe('utils', () => {
  test('valid version node.js', () => {
    expect(isVersionValid('v14.0.0')).toBeTruthy();
    expect(isVersionValid('v15.0.0')).toBeTruthy();
    expect(isVersionValid('v16.0.0')).toBeTruthy();
    expect(isVersionValid('v17.0.0')).toBeTruthy();
  });

  test('is invalid version node.js', () => {
    expect(isVersionValid('v13.0.0')).toBeFalsy();
    expect(isVersionValid('v12.0.0')).toBeFalsy();
    expect(isVersionValid('v8.0.0')).toBeFalsy();
    expect(isVersionValid('v4.0.0')).toBeFalsy();
    expect(isVersionValid('v0.0.10')).toBeFalsy();
  });
});
