import { Manifest } from '@verdaccio/types';

export interface DistTags {
  [key: string]: string;
}

/**
 * Generate package metadata for a published package.
 * This is the shape that a package manager would send to the registry. *
 * @export
 * @param {string} pkgName
 * @param {string} [version='1.0.0']
 * @param {DistTags} [distTags={ ['latest']: version }]
 * @param {string} [description='package generated']
 * @param {string} [readme='# test']
 * @return {*}  {Manifest}
 */
export function generatePublishNewVersionManifest(
  pkgName: string,
  version = '1.0.0',
  distTags: DistTags = { ['latest']: version },
  description = 'package generated',
  readme = '# test'
): Manifest {
  // @ts-ignore
  return {
    _id: pkgName,
    description,
    'dist-tags': {
      ...distTags,
    },
    versions: {
      [version]: {
        name: pkgName,
        version: version,
        description,
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
          tarball: `http:\/\/localhost:5555\/${pkgName}\/-\/${pkgName}-${version}.tgz`,
        },
      },
    },
    access: null,
    readme,
    _attachments: {
      [`${pkgName}-${version}.tgz`]: {
        content_type: 'application/octet-stream',
        data: 'H4sIAAAAAAAC/+2SP0/DMBDFM+dTnDx0QsFpEyN1RQzMjBQiyzlat8Q2tgOtUL8754R/A2OFBMpvOee9i++dZCfVTq7x3I212AZrshPDORdVBT/piWpeQ7aoBS9LITj10aGuLqhmv0AfovQU5QRLEvBZ/wivOQAzskO2pOq6JmKIjfPNnAt2lsxn9EFbk/yy4AUf1RaD8trFd2cUO6mHL21a3NNTGtWxMZCRhpGQRqQ2VBsLK3blvfVLMBaSAcGh0g8a2xWD2QxwryOUjP48Drft8PBifZuuu70bFNnHjfVfKR61QhOGha5vLj/iOqRQRmn8FmT71KM/pMb7RSFotTQlP+bZxMTExP/nDZZA1xkACAAA',
        length: 276,
      },
    },
  };
}
