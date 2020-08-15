import { Package } from '@verdaccio/types';

export interface DistTags {
  [key: string]: string;
}

export function generatePackageMetadata(pkgName: string, version = '1.0.0', distTags: DistTags = { ['latest']: version }): Package {
  // @ts-ignore
  return {
    _id: pkgName,
    name: pkgName,
    'dist-tags': {
      ...distTags,
    },
    versions: {
      [version]: {
        name: pkgName,
        version: version,
        description: '',
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
          integrity: 'sha512-6gHiERpiDgtb3hjqpQH5/i7zRmvYi9pmCjQf2ZMy3QEa9wVk9RgdZaPWUt7ZOnWUPFjcr9cmE6dUBf+XoPoH4g==',
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9', // pragma: allowlist secret
          tarball: `http:\/\/localhost:5555\/${pkgName}\/-\/${pkgName}-${version}.tgz`,
        },
      },
    },
    readme: '# test',
    _attachments: {
      [`${pkgName}-${version}.tgz`]: {
        content_type: 'application/octet-stream',
        data: 'H4sIAAAAAAAAE+2W32vbMBDH85y',
        length: 512,
      },
    },
  };
}
