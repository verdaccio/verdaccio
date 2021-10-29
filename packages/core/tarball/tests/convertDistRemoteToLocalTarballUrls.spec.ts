import * as httpMocks from 'node-mocks-http';

import { HEADERS } from '@verdaccio/core';

import { convertDistRemoteToLocalTarballUrls } from '../src';

describe('convertDistRemoteToLocalTarballUrls', () => {
  const fakeHost = 'fake.com';
  const buildURI = (host, version) => `http://${host}/npm_test/-/npm_test-${version}.tgz`;
  const cloneMetadata = (pkg = metadata) => Object.assign({}, pkg);
  const metadata: any = {
    name: 'npm_test',
    versions: {
      '1.0.0': {
        dist: {
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.0.tgz',
        },
      },
      '1.0.1': {
        dist: {
          tarball: 'http://registry.org/npm_test/-/npm_test-1.0.1.tgz',
        },
      },
    },
  };
  test('should build a URI for dist tarball based on new domain', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: fakeHost,
        [HEADERS.FORWARDED_PROTO]: 'http',
      },
      url: '/',
    });
    const convertDist = convertDistRemoteToLocalTarballUrls(cloneMetadata(), {
      host: req.hostname,
      headers: req.headers as any,
      protocol: req.protocol,
    });
    expect(convertDist.versions['1.0.0'].dist.tarball).toEqual(buildURI(fakeHost, '1.0.0'));
    expect(convertDist.versions['1.0.1'].dist.tarball).toEqual(buildURI(fakeHost, '1.0.1'));
  });

  test('should return same URI whether host is missing', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'http',
      },
      url: '/',
    });
    const convertDist = convertDistRemoteToLocalTarballUrls(cloneMetadata(), {
      host: req.hostname,
      headers: req.headers as any,
      protocol: req.protocol,
    });
    expect(convertDist.versions['1.0.0'].dist.tarball).toEqual(
      convertDist.versions['1.0.0'].dist.tarball
    );
  });

  test('should return same URI whether host is undefined', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: undefined,
      },
      url: '/',
    });
    const convertDist = convertDistRemoteToLocalTarballUrls(cloneMetadata(), {
      host: req.hostname,
      headers: req.headers as any,
      protocol: req.protocol,
    });
    expect(convertDist.versions['1.0.0'].dist.tarball).toEqual(
      convertDist.versions['1.0.0'].dist.tarball
    );
  });
});
