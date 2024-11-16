import { describe, expect, it } from 'vitest';

import { Manifest } from '@verdaccio/types';

import { getDeprecatedPackageMetadata } from '../src/getDeprecatedPackageMetadata';
import { DistTags } from '../src/types';

describe('getDeprecatedPackageMetadata', () => {
  const pkgName = 'test-package';
  const version = '2.0.0';
  const distTags: DistTags = { latest: '2.0.0' };
  const deprecatedMessage = 'This package version is deprecated';
  const rev = 'rev-bar';

  it('should generate a deprecated package manifest with default values', () => {
    const result: Manifest = getDeprecatedPackageMetadata(pkgName);

    expect(result.name).toBe(pkgName);
    expect(result.versions['1.0.0'].deprecated).toBe('default deprecated message');
    expect(result._rev).toBe('rev-foo');
    expect(result._attachments).toEqual({});
  });

  it('should generate a deprecated package manifest with specified version, distTags, and deprecated message', () => {
    const result: Manifest = getDeprecatedPackageMetadata(
      pkgName,
      version,
      distTags,
      deprecatedMessage,
      rev
    );

    expect(result.name).toBe(pkgName);
    expect(result.versions[version]).toBeDefined();
    expect(result.versions[version].deprecated).toBe(deprecatedMessage);
    expect(result['dist-tags']).toEqual(distTags);
    expect(result._rev).toBe(rev);
    expect(result._attachments).toEqual({});
  });
});
