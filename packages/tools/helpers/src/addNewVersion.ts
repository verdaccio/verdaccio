import { Manifest } from '@verdaccio/types';

import { getTarball } from './utils';

export function addNewVersion(
  manifest: Manifest,
  version: string,
  isRemote: boolean = true,
  domain: string = 'http://localhost:5555'
): Manifest {
  const currentVersions = Object.keys(manifest.versions);
  if (currentVersions.includes(version)) {
    throw new Error(`Version ${version} already exists`);
  }

  const newManifest = { ...manifest };
  newManifest.versions[version] = {
    name: manifest.name,
    version,
    description: manifest.description ?? '',
    readme: '',
    main: 'index.js',
    scripts: { test: 'echo "Error: no test specified" && exit 1' },
    keywords: [],
    author: { name: 'User NPM', email: 'user@domain.com' },
    license: 'ISC',
    dependencies: { verdaccio: '^2.7.2' },
    readmeFilename: 'README.md',
    _id: `${manifest.name}@${version}`,
    _npmVersion: '5.5.1',
    _npmUser: { name: 'foo', email: 'user@domain.com' },
    dist: {
      integrity: 'sha512-6gHiERpiDgtb3hjqpQHoPoH4g==',
      shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
      tarball: `${domain}/${manifest.name}/-/${getTarball(manifest.name)}-${version}.tgz`,
    },
    contributors: [],
  };
  // update the latest with the new version
  newManifest['dist-tags'] = { latest: version };
  // add new version does not need attachments
  if (isRemote) {
    newManifest._distfiles = {
      ...newManifest._distfiles,
      [`${getTarball(manifest.name)}-${version}.tgz`]: {
        sha: '2c03764f651a9f016ca0b7620421457b619151b9',
        url: `${domain}/${manifest.name}/-/${getTarball(manifest.name)}-${version}.tgz`,
      },
    };
  } else {
    newManifest._attachments = {
      ...newManifest._attachments,
      [`${getTarball(manifest.name)}-${version}.tgz`]: {
        shasum: '2c03764f651a9f016ca0b7620421457b619151b9', // pragma: allowlist secret
        version: version,
      },
    };
  }
  return newManifest;
}
