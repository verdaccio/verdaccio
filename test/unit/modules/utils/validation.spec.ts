import { describe, expect, test } from 'vitest';

import { isNameValid, isPackageValid } from '../../../../src/lib/validation';

describe('validation', () => {
  test('rejects wildcard filenames that storage sanitizers rewrite', () => {
    expect(isNameValid('*.verdaccio-db.json')).toBeFalsy();
    expect(isNameValid('%2A.verdaccio-db.json')).toBeFalsy();
  });

  test('rejects wildcard package names that can bypass package ACL matching', () => {
    expect(isPackageValid('*priv-thing')).toBeFalsy();
    expect(isPackageValid('@*priv/thing')).toBeFalsy();
    expect(isPackageValid('@priv/*thing')).toBeFalsy();
  });

  test('keeps ordinary package and tarball names valid', () => {
    expect(isPackageValid('priv-thing')).toBeTruthy();
    expect(isPackageValid('@priv/thing')).toBeTruthy();
    expect(isNameValid('thing-1.0.0.tgz')).toBeTruthy();
  });
});
