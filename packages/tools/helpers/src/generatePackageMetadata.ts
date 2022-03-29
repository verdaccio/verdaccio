import { Manifest } from '@verdaccio/types';

export interface DistTags {
  [key: string]: string;
}

const getTarball = (name: string): string => {
  const r = name.split('/');
  if (r.length === 1) {
    return r[0];
  } else {
    return r[1];
  }
};

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
    _npmUser: { name: 'foo' },
    dist: {
      integrity: 'sha512-6gHiERpiDgtb3hjqpQHoPoH4g==',
      shasum: '2c03764f651a9f016ca0b7620421457b619151b9',
      tarball: `${domain}/${manifest.name}/-/${getTarball(manifest.name)}-${version}.tgz`,
    },
    contributors: [],
  };
  // update the latest with the new version
  newManifest['dist-tags'] = { latest: version };
  // add new version does not need attachmetns
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

export function generateLocalPackageMetadata(
  pkgName: string,
  version = '1.0.0',
  domain: string = 'http://localhost:5555'
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

export function generateRemotePackageMetadata(
  pkgName: string,
  version = '1.0.0',
  domain: string = 'http://localhost:5555'
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
        },
        dist: {
          integrity:
            'sha512-6gHiERpiDgtb3hjqpQH5/i7zRmvYi9pmCjQf2ZMy3QEa9wVk9RgdZaPWUt7ZOnWUPFjcr9cm' +
            'E6dUBf+XoPoH4g==',
          shasum: '2c03764f651a9f016ca0b7620421457b619151b9', // pragma: allowlist secret
          tarball: `${domain}\/${pkgName}\/-\/${getTarball(pkgName)}-${version}.tgz`,
        },
      },
    },
    readme: '# test',
    _attachments: {},
    _uplinks: {},
    _distfiles: {
      [`${pkgName}-${version}.tgz`]: {
        url: `${domain}/${pkgName}\/-\/${getTarball(pkgName)}-${version}.tgz`,
        sha: '2c03764f651a9f016ca0b7620421457b619151b9', // pragma: allowlist secret
      },
    },
    _rev: '',
  };
}

export function generatePackageMetadata(
  pkgName: string,
  version = '1.0.0',
  distTags: DistTags = { ['latest']: version }
): Manifest {
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
          tarball: `http:\/\/localhost:5555\/${pkgName}\/-\/${getTarball(pkgName)}-${version}.tgz`,
        },
      },
    },
    readme: '# test',
    _attachments: {
      [`${getTarball(pkgName)}-${version}.tgz`]: {
        content_type: 'application/octet-stream',
        data:
          'H4sIAAAAAAAAE+2W32vbMBDH85y/QnjQp9qxLEeBMsbGlocNBmN7bFdQ5WuqxJaEpGQdo//79KPeQsnI' +
          'w5KUDX/9IOvurLuz/DHSjK/YAiY6jcXSKjk6sMqypHWNdtmD6hlBI0wqQmo8nVbVqMR4OsNoVB66kF1a' +
          'W8eML+Vv10m9oF/jP6IfY4QyyTrILlD2eqkcm+gVzpdrJrPz4NuAsULJ4MZFWdBkbcByI7R79CRjx0Sc' +
          'CdnAvf+SkjUFWu8IubzBgXUhDPidQlfZ3BhlLpBUKDiQ1cDFrYDmKkNnZwjuhUM4808+xNVW8P2bMk1Y' +
          '7vJrtLC1u1MmLPjBF40+Cc4ahV6GDmI/DWygVRpMwVX3KtXUCg7Sxp7ff3nbt6TBFy65gK1iffsN41yo' +
          'EHtdFbOiisWMH8bPvXUH0SP3k+KG3UBr+DFy7OGfEJr4x5iWVeS/pLQe+D+FIv/agIWI6GX66kFuIhT+' +
          '1gDjrp/4d7WAvAwEJPh0u14IufWkM0zaW2W6nLfM2lybgJ4LTJ0/jWiAK8OcMjt8MW3OlfQppcuhhQ6k' +
          '+2OgkK2Q8DssFPi/IHpU9fz3/+xj5NjDf8QFE39VmE4JDfzPCBn4P4X6/f88f/Pu47zomiPk2Lv/dOv8' +
          'h+P/34/D/p9CL+Kp67mrGDRo0KBBp9ZPsETQegASAAA=+2W32vbMBDH85y',
        length: 512,
      },
    },
    _uplinks: {},
    _distfiles: {},
    _rev: '',
  };
}
