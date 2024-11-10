import { UnPublishManifest } from '@verdaccio/types';

export function generateUnPublishPackageMetadata(
  pkgName: string,
  versions: string[] = ['1.0.0'],
  distTags,
  rev: string
): UnPublishManifest {
  const versionsData = versions.reduce((acc, version) => {
    acc[version] = {
      name: pkgName,
      version: version,
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      author: {
        name: 'Verdaccio Maintainers',
        email: 'verdaccio.npm@gmail.com',
      },
      repository: {
        type: 'git',
        url: 'https://github.com/verdaccio/verdaccio.git',
      },
      homepage: 'https://verdaccio.org',
      funding: {
        type: 'opencollective',
        url: 'https://opencollective.com/verdaccio',
      },
      keywords: [],
      license: 'ISC',
      dependencies: {
        '@verdaccio/logger-7': '^6.0.0-6-next.3',
      },
      bugs: {
        url: 'https://github.com/verdaccio/verdaccio/issues',
      },
      devDependencies: {},
      _id: `${pkgName}@${version}`,
      _nodeVersion: '20.10.0',
      _npmVersion: '10.9.0',
      dist: {
        integrity:
          'sha512-qc+palHxTF5tUhtAHGikwmv7EqhybOZ3cHUvGQZ9H2a8C7VXQ0e4ZVYS7qpNvYmG3m3khfMzsmx/R96BcxaPfw==',
        shasum: '4ece00c13d4a99722275afb6270d44ca158aaaa0',
        tarball: `http://localhost:8000/${pkgName}/-/${pkgName}-${version}.tgz`,
        fileCount: 3,
        unpackedSize: 6488666,
      },
      contributors: [],
      maintainers: [
        {
          name: 'test',
          email: '',
        },
      ],
    };
    return acc;
  }, {});

  const timeData = versions.reduce(
    (acc, version) => {
      const now = new Date().toISOString();
      acc[version] = now;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    _id: pkgName,
    name: pkgName,
    'dist-tags': { ...distTags },
    versions: versionsData,
    time: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      ...timeData,
    },
    maintainers: [
      {
        name: 'test',
        email: '',
      },
    ],
    readme: 'ERROR: No README data found!',
    _rev: rev,
  };
}
