import { DIST_TAGS } from '@verdaccio/core';
import type { Dist, DistFile, Manifest, Version } from '@verdaccio/types';

const versionStub: Version = {
  _id: '',
  main: '',
  name: '',
  readme: '',
  version: '',
} as Version; // Some properties are omitted on purpose

export const emptyManifest: Manifest = {} as Manifest;

export const babelTestManifest: Manifest = {
  [DIST_TAGS]: { latest: '3.0.0' },
  _attachments: {},
  _distfiles: {},
  _rev: '',
  _uplinks: {},
  name: '@babel/test',
  versions: {
    '1.0.0': { ...versionStub, _id: '@babel/test@1.0.0' },
    '1.5.0': { ...versionStub, _id: '@babel/test@1.5.0' },
    '3.0.0': { ...versionStub, _id: '@babel/test@3.0.0' },
  },
  time: {
    modified: '2024-01-01T00:00:00.123Z',
    created: '2020-01-01T00:00:00.000Z',
    '1.0.0': '2020-01-01T00:00:00.000Z',
    '1.5.0': '2022-01-01T00:00:00.000Z',
    '3.0.0': '2024-01-01T00:00:00.000Z',
  },
  readme: 'It is a babel test package',
};

export const typesNodeManifest: Manifest = {
  [DIST_TAGS]: { latest: '2.6.3' },
  _attachments: {},
  _distfiles: {},
  _rev: '',
  _uplinks: {},
  name: '@types/node',
  versions: {
    '1.0.0': { ...versionStub, _id: '@types/node@1.0.0' },
    '2.2.0': { ...versionStub, _id: '@types/node@2.2.0' },
    '2.6.3': { ...versionStub, _id: '@types/node@2.6.3' },
  },
  time: {
    modified: '2025-01-01T00:00:00.456Z',
    created: '2010-01-01T00:00:00.000Z',
    '1.0.0': '2010-01-01T00:00:00.000Z',
    '2.2.0': '2015-01-01T00:00:00.000Z',
    '2.6.3': '2025-01-01T00:00:00.000Z',
  },
  readme: 'It is a types node package',
};

export const testaccioManifest: Manifest = {
  [DIST_TAGS]: {
    latest: '1.7.0',
    beta: '1.7.1-beta',
    next: '2.2.1-next',
  },
  _attachments: {},
  _distfiles: {
    'testaccio-test-1.4.2.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.4.2.tgz',
    } as DistFile,
    'testaccio-test-1.4.4-beta.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.4.4-beta.tgz',
    } as DistFile,
    'testaccio-test-1.7.0.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.7.0.tgz',
    } as DistFile,
    'testaccio-test-1.7.1-beta.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.7.1-beta.tgz',
    } as DistFile,
    'testaccio-test-2.2.1-next.tgz': {
      url: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-2.2.1-next.tgz',
    } as DistFile,
  },
  _rev: '',
  _uplinks: {},
  name: '@testaccio/test',
  versions: {
    '1.4.2': {
      ...versionStub,
      _id: '@testaccio/test@1.4.2',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.4.2.tgz',
      } as Dist,
    },
    '1.4.4-beta': {
      ...versionStub,
      _id: '@testaccio/test@1.4.4-beta',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.4.4-beta.tgz',
      } as Dist,
    },
    '1.7.0': {
      ...versionStub,
      _id: '@testaccio/test@1.7.0',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.7.0.tgz',
      } as Dist,
    },
    '1.7.1-beta': {
      ...versionStub,
      _id: '@testaccio/test@1.7.1-beta',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-1.7.1-beta.tgz',
      } as Dist,
    },
    '2.2.1-next': {
      ...versionStub,
      _id: '@testaccio/test@2.2.1-next',
      dist: {
        tarball: 'https://registry.npmjs.org/@testaccio/test/-/testaccio-test-2.2.1-next.tgz',
      } as Dist,
    },
  },
  time: {
    modified: '2023-03-01T00:00:00.000Z',
    created: '2021-05-01T00:00:00.000Z',
    '1.4.2': '2021-05-01T00:00:00.000Z',
    '1.4.4-beta': '2021-06-01T00:00:00.000Z',
    '1.7.0': '2022-02-01T00:00:00.000Z',
    '1.7.1-beta': '2022-03-01T00:00:00.000Z',
    '2.2.1-next': '2023-03-01T00:00:00.000Z',
  },
  readme: 'It is a testaccio test package',
};
