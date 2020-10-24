const pkg = {
  name: '@scope/test_npm',
  versions: {
    '1.0.1': {
      name: '@scope/test_npm',
      version: '1.0.1',
      description: '',
      main: 'index.js',
      scripts: {
        test: "echo 'Error: no test specified' && exit 1",
      },
      author: {
        name: 'User Npm',
        email: 'me@domain.com',
        url: 'http://domain.com/',
      },
      license: 'ISC',
      dependencies: {
        'create-react-app': '^1.4.1',
        'fast-static-site': '^1.0.2',
        watchdom: '^1.0.2',
      },
      _id: '@scope/test_npm@1.0.1',
      _npmVersion: '5.6.0',
      _nodeVersion: '9.4.0',
      _npmUser: {
        name: 'userNpm',
        email: 'dsa@domain.com',
      },
      maintainers: [
        {
          name: 'userNpm',
          email: 'dsa@domain.com',
        },
      ],
      dist: {
        integrity:
          'sha512-0ThGF2zZiOGmLoHl/n5cMwAS6swbAz7rdzDjgkyDh+C2rADzNfPIfo7KBTRHbY6uJ9akBCvWDFBuR0fgaxYnjQ==',
        shasum: '1df0c3dfd289b2ac6ef00b0129cab9737eeaa62d',
        tarball: 'http://localhost:4873/@scope/test_npm/-/@scope/test_npm-1.0.1.tgz',
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
    'test_npm-1.0.1.tgz': {
      shasum: '1df0c3dfd289b2ac6ef00b0129cab9737eeaa62d',
      version: '1.0.1',
    },
  },
  _uplinks: {},
  _rev: '5-ea87644a96a129cf',
  readme: 'ERROR: No README data found!',
};

export function generatePkg(name: any) {
  return {
    name: `@scope/${name}`,
    versions: {
      '1.0.1': {
        name: `@scope/${name}`,
        version: '1.0.1',
        description: '',
        main: 'index.js',
        scripts: {
          test: "echo 'Error: no test specified' && exit 1",
        },
        author: {
          name: 'User Npm',
          email: 'me@domain.com',
          url: 'http://domain.com/',
        },
        license: 'ISC',
        dependencies: {
          'create-react-app': '^1.4.1',
          'fast-static-site': '^1.0.2',
          watchdom: '^1.0.2',
        },
        _id: `@scope/${name}@1.0.1`,
        _npmVersion: '5.6.0',
        _nodeVersion: '9.4.0',
        _npmUser: {
          name: 'userNpm',
          email: 'dsa@domain.com',
        },
        maintainers: [
          {
            name: 'userNpm',
            email: 'dsa@domain.com',
          },
        ],
        dist: {
          integrity: 'sha512-0ThGF2zZiOGmLoHl==',
          shasum: '1df0c3dfd289b2ac6ef00b0129cab9737eeaa62d',
          tarball: `http://localhost:4873/@scope/${name}/-/@scope/${name}-1.0.1.tgz`,
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
      'test_npm-1.0.1.tgz': {
        shasum: '1df0c3dfd2aa62d',
        version: '1.0.1',
      },
    },
    _uplinks: {},
    _rev: '5-ea87644a96a129cf',
    readme: 'readme test',
  };
}

export default pkg;
