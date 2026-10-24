import { createHash } from 'node:crypto';

import type { Manifest } from '@verdaccio/types';

import { generatePackageMetadata } from './generatePackageMetadata';
import { getTarball } from './utils';

/**
 * Publish manifest for one version whose attachment, shasum and integrity match a real tarball.
 */
export function generatePackageMetadataWithTarball(
  pkgName: string,
  version: string,
  tarball: Buffer,
  readme = ''
): Manifest {
  const manifest = generatePackageMetadata(pkgName, version);
  manifest.readme = readme;
  manifest.versions[version].readme = readme;
  manifest.versions[version].dist.shasum = createHash('sha1').update(tarball).digest('hex');
  manifest.versions[version].dist.integrity =
    `sha512-${createHash('sha512').update(tarball).digest('base64')}`;
  manifest._attachments = {
    [`${getTarball(pkgName)}-${version}.tgz`]: {
      content_type: 'application/octet-stream',
      data: tarball.toString('base64'),
      length: tarball.length,
    },
  };
  return manifest;
}
