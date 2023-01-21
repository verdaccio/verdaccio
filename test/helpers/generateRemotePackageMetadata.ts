import { FullRemoteManifest, GenericBody, Version, Versions } from '@verdaccio/types';

import { getTarball } from './utils';

export function generateRemotePackageMetadata(
  pkgName: string,
  version = '1.0.0',
  domain: string = 'http://localhost:5555',
  versions: string[] = []
): FullRemoteManifest {
  // @ts-ignore
  const generateVersion = (version: string): Version => {
    const metadata = {
      name: pkgName,
      version: version,
      description: 'package generated',
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      keywords: [],
      author: {
        name: 'User NPM',
        email: 'user@domain.com',
      },
      license: 'ISC',
      dependencies: {
        verdaccio: '^2.7.2',
      },
      readme: '# test',
      readmeFilename: 'README.md',
      _id: `${pkgName}@${version}`,
      _npmVersion: '5.5.1',
      _npmUser: {
        name: 'foo',
      },
      dist: {
        integrity:
          'sha512-6gHiERpiDgtb3hjqpQH5/i7zRmvYi9pmCjQf2ZMy3QEa9wVk9RgdZaPWUt7ZOnWUPFjcr9cm' +
          'E6dUBf+XoPoH4g==',
        shasum: '2c03764f651a9f016ca0b7620421457b619151b9', // pragma: allowlist secret
        tarball: `${domain}\/${pkgName}\/-\/${getTarball(pkgName)}-${version}.tgz`,
      },
    };

    return metadata;
  };
  const mappedVersions: Versions = versions.reduce((acc, v) => {
    acc[v] = generateVersion(v);
    return acc;
  }, {});

  const mappedTimes: GenericBody = versions.reduce((acc, v) => {
    const date = new Date(Date.now());
    acc[v] = date.toISOString();
    return acc;
  }, {});

  return {
    _id: pkgName,
    name: pkgName,
    description: '',
    'dist-tags': { ['latest']: version },
    versions: {
      [version]: generateVersion(version),
      ...mappedVersions,
    },
    time: {
      modified: '2019-06-13T06:44:45.747Z',
      created: '2019-06-13T06:44:45.747Z',
      [version]: '2019-06-13T06:44:45.747Z',
      ...mappedTimes,
    },
    maintainers: [
      {
        name: 'foo',
        email: 'foo@foo.com',
      },
    ],
    author: {
      name: 'foo',
    },
    readme: '# test',
    _rev: '12-c8fe8a9c79fa57a87347a0213e6f2548',
  };
}
