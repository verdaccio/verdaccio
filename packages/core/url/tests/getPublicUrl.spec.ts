import * as httpMocks from 'node-mocks-http';

import { HEADERS } from '@verdaccio/commons-api';
import { getPublicUrl } from '../src';

describe('host', () => {
  // this scenario is usual when reverse proxy is setup
  // without the host header
  test('get empty string with missing host header', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });
    expect(getPublicUrl(undefined, req)).toEqual('/');
  });

  test('get a valid host', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
      },
      url: '/',
    });
    // @ts-expect-error
    expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
  });

  test('check a valid host header injection', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: `some.com"><svg onload="alert(1)">`,
      },
      url: '/',
    });
    expect(function () {
      // @ts-expect-error
      getPublicUrl({}, req);
    }).toThrow('invalid host');
  });

  test('get a valid host with prefix', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
      },
      url: '/',
    });

    expect(getPublicUrl('/prefix/', req)).toEqual('http://some.com/prefix/');
  });

  test('get a valid host with prefix no trailing', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
      },
      url: '/',
    });

    expect(getPublicUrl('/prefix-no-trailing', req)).toEqual('http://some.com/prefix-no-trailing/');
  });

  test('get a valid host with null prefix', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
      },
      url: '/',
    });

    expect(getPublicUrl(null, req)).toEqual('http://some.com/');
  });
});

describe('X-Forwarded-Proto', () => {
  test('with a valid X-Forwarded-Proto https', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
        [HEADERS.FORWARDED_PROTO]: 'https',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('https://some.com/');
  });

  test('with a invalid X-Forwarded-Proto https', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
        [HEADERS.FORWARDED_PROTO]: 'invalidProto',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
  });

  test('with a HAProxy X-Forwarded-Proto https', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
        [HEADERS.FORWARDED_PROTO]: 'https,https',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('https://some.com/');
  });

  test('with a HAProxy X-Forwarded-Proto different protocol', () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
        [HEADERS.FORWARDED_PROTO]: 'http,https',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
  });
});

describe('env variable', () => {
  test('with a valid X-Forwarded-Proto https and env variable', () => {
    process.env.VERDACCIO_PUBLIC_URL = 'https://env.domain.com';
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
        [HEADERS.FORWARDED_PROTO]: 'https',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('https://env.domain.com/');
    delete process.env.VERDACCIO_PUBLIC_URL;
  });

  test('with a valid X-Forwarded-Proto https and env variable with prefix', () => {
    process.env.VERDACCIO_PUBLIC_URL = 'https://env.domain.com/urlPrefix/';
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
        [HEADERS.FORWARDED_PROTO]: 'https',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('https://env.domain.com/urlPrefix/');
    delete process.env.VERDACCIO_PUBLIC_URL;
  });

  test('with a invalid X-Forwarded-Proto https and env variable', () => {
    process.env.VERDACCIO_PUBLIC_URL = 'https://env.domain.com/';
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
        [HEADERS.FORWARDED_PROTO]: 'invalidProtocol',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('https://env.domain.com/');
    delete process.env.VERDACCIO_PUBLIC_URL;
  });

  test('with a invalid X-Forwarded-Proto https and invalid url with env variable', () => {
    process.env.VERDACCIO_PUBLIC_URL = 'ftp://env.domain.com';
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
        [HEADERS.FORWARDED_PROTO]: 'invalidProtocol',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
    delete process.env.VERDACCIO_PUBLIC_URL;
  });

  test('with a invalid X-Forwarded-Proto https and host injection with host', () => {
    process.env.VERDACCIO_PUBLIC_URL = 'http://injection.test.com"><svg onload="alert(1)">';
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some.com',
        [HEADERS.FORWARDED_PROTO]: 'invalidProtocol',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('http://some.com/');
    delete process.env.VERDACCIO_PUBLIC_URL;
  });

  test('with a invalid X-Forwarded-Proto https and host injection with invalid host', () => {
    process.env.VERDACCIO_PUBLIC_URL = 'http://injection.test.com"><svg onload="alert(1)">';
    const req = httpMocks.createRequest({
      method: 'GET',
      headers: {
        host: 'some',
        [HEADERS.FORWARDED_PROTO]: 'invalidProtocol',
      },
      url: '/',
    });

    expect(getPublicUrl(undefined, req)).toEqual('http://some/');
    delete process.env.VERDACCIO_PUBLIC_URL;
  });
});
