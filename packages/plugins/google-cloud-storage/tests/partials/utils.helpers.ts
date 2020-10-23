import { Package } from '@verdaccio/types';

export function generatePackage(name: any): Package {
  return {
    name: name,
    versions: {
      '1.0.1': {
        name: name,
        version: '1.0.1',
        description: '',
        main: 'index.js',
        scripts: {
          test: "echo 'Error: no test specified' && exit 1",
        },
        author: {
          name: 'npmUser',
          email: 'me@email.com',
          url: 'http://domain.com/',
        },
        license: 'ISC',
        dependencies: {
          'create-react-app': '^1.4.1',
          'fast-static-site': '^1.0.2',
          watchdom: '^1.0.2',
        },
        _id: `${name}@1.0.1`,
        _npmVersion: '5.6.0',
        nodeVersion: '9.4.0',
        readme: '',
        _npmUser: {
          name: 'jpicado',
          email: 'dsa@dasd.com',
        },
        maintainers: [
          {
            name: 'jpicado',
            email: 'dsa@dasd.com',
          },
        ],
        dist: {
          integrity:
            'sha512-0ThGF2zZiOGmLoHl/n5cMwAS6swbAz7rdzDjgkyDh+C2rADzNfPIfo7KBTRHbY6uJ9akBCvWDFBuR0fgaxYnjQ==',
          shasum: '1df0c3dfd289b2ac6ef00b0129cab9737eeaa62d',
          tarball: `http://localhost:4873/${name}/-/${name}-1.0.1.tgz`,
        },
      },
    },
    'dist-tags': {
      latest: '1.0.1',
    },
    time: {
      modified: '2018-02-20T17:50:47.944Z',
      created: '2018-02-20T17:50:47.944Z',
      '1.0.1': '2018-02-20T17:50:47.944Z',
    },
    _distfiles: {},
    _attachments: {
      [`${name}-1.0.1.tgz`]: {
        shasum: '1df0c3dfd289b2ac6ef00b0129cab9737eeaa62d',
        version: '1.0.1',
      },
    },
    _uplinks: {},
    _rev: '5-ea87644a96a129cf',
    readme: 'Custom readme',
  };
}
