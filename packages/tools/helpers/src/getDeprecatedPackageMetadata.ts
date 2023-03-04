import { Manifest } from '@verdaccio/types';

import { generatePackageMetadata } from './generatePackageMetadata';
import { DistTags } from './types';

export function getDeprecatedPackageMetadata(
  pkgName: string,
  version = '1.0.0',
  distTags: DistTags = { ['latest']: version },
  deprecated = 'default deprecated message',
  rev = 'rev-foo'
): Manifest {
  const manifest = generatePackageMetadata(pkgName, version, distTags);
  // deprecated message requires empty attachments
  manifest._attachments = {};
  manifest._rev = rev;
  manifest.versions[version].deprecated = deprecated;
  return manifest;
}
