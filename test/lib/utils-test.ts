import { Version } from '@verdaccio/types';

export function generateNewVersion(
  pkgName: string,
  version: string,
  shashum = '238e7641e59508dc9c20eb4ad37a8aa57ab777b4'
): Version {
  return {
    name: pkgName,
    version: version,
    description: '',
    main: 'index.js',
    dependencies: {
      test: '^1.4.1',
    },
    author: '',
    license: 'ISC',
    readme: 'ERROR: No README data found!',
    _id: `${pkgName}@${version}`,
    _npmVersion: '5.5.1',
    _npmUser: {
      name: 'Foo',
    },
    dist: {
      integrity:
        'sha512-zVEqt1JUCOPsash9q4wMkJEDPD+QCx95TRhQII+JnoS31uBUKoZxhzvvUJCcLVy2CQG4QdwXARU7dYWPnrwhGg==',
      shasum: shashum,
      tarball: `http:\/\/localhost:4873\/${pkgName}\/-\/${pkgName}-${version}.tgz`,
    },
  };
}
