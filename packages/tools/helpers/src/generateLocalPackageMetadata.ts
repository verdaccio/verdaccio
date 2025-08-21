import { GenericBody, Manifest } from '@verdaccio/types';

import { getTarball } from './utils';

export function generateLocalPackageMetadata(
  pkgName: string,
  version = '1.0.0',
  domain: string = 'http://localhost:5555',
  time?: GenericBody
): Manifest {
  // @ts-ignore
  return {
    _id: pkgName,
    name: pkgName,
    description: '',
    'dist-tags': { ['latest']: version },
    versions: {
      [version]: {
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
          email: 'user@domain.com',
        },
        dist: {
          integrity:
            'sha512-6gHiERpiDgtb3hjqpQH5/i7zRmvYi9pmCjQf2ZMy3QEa9wVk9RgdZaPWUt7ZOnWUPFjcr9cm' +
            'E6dUBf+XoPoH4g==',
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9', // pragma: allowlist secret
          tarball: `${domain}/${pkgName}\/-\/${getTarball(pkgName)}-${version}.tgz`,
        },
      },
    },
    time: time ?? {
      modified: new Date().toISOString(),
      created: new Date().toISOString(),
      [version]: new Date().toISOString(),
    },
    readme: '# test',
    _attachments: {
      [`${getTarball(pkgName)}-${version}.tgz`]: {
        shasum: '2c03764f651a9f016ca0b7620421457b619151b9', // pragma: allowlist secret
        version: version,
      },
    },
    _uplinks: {},
    _distfiles: {},
    _rev: '',
  };
}
