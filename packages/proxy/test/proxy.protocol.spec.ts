import { beforeEach, describe, expect, test, vi } from 'vitest';

import { Logger } from '@verdaccio/types';

import { ProxyStorage } from '../src';

const mockDebug = vi.fn();
const mockInfo = vi.fn();
const mockHttp = vi.fn();
const mockError = vi.fn();
const mockWarn = vi.fn();

const logger = {
  debug: mockDebug,
  info: mockInfo,
  http: mockHttp,
  error: mockError,
  warn: mockWarn,
} as unknown as Logger;

function getProxyInstance(host, uplinkConf, appConfig) {
  uplinkConf.url = host;

  return new ProxyStorage('uplink', uplinkConf, appConfig, logger);
}

describe('Check protocol of proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('validate main config protocol - http', () => {
    expect(
      getProxyInstance(
        'http://registry.domain.org',
        { http_proxy: 'http://registry.local.org' },
        {}
      ).proxy
    ).toEqual('http://registry.local.org');
  });
  test('main config invalid protocol - http', () => {
    expect(
      getProxyInstance(
        'http://registry.domain.org',
        { http_proxy: 'https://registry.local.org' },
        {}
      ).proxy
    ).toEqual(undefined);
    expect(mockError).toHaveBeenCalledOnce();
  });
  test('main config invalid protocol - https', () => {
    expect(
      getProxyInstance(
        'https://registry.domain.org',
        { https_proxy: 'http://registry.local.org' },
        {}
      ).proxy
    ).toEqual(undefined);
    expect(mockError).toHaveBeenCalledOnce();
  });

  test('validate uplink config protocol - http', () => {
    expect(
      getProxyInstance(
        'https://registry.domain.org',
        {},
        { https_proxy: 'https://proxy.domain.org' }
      ).proxy
    ).toEqual('https://proxy.domain.org');
  });
  test('uplink config invalid protocol - http', () => {
    expect(
      getProxyInstance('http://registry.domain.org', {}, { http_proxy: 'https://proxy.domain.org' })
        .proxy
    ).toEqual(undefined);
    expect(mockError).toHaveBeenCalledOnce();
  });
  test('uplink config invalid protocol - https', () => {
    expect(
      getProxyInstance(
        'https://registry.domain.org',
        {},
        { https_proxy: 'http://proxy.domain.org' }
      ).proxy
    ).toEqual(undefined);
    expect(mockError).toHaveBeenCalledOnce();
  });
});
