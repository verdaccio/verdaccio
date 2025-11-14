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
  test('main config - http registry, http proxy', () => {
    expect(
      getProxyInstance('http://registry.domain.org', { http_proxy: 'http://proxy.local' }, {}).proxy
    ).toEqual('http://proxy.local');
  });
  test('main config - http registry, https proxy', () => {
    expect(
      getProxyInstance('http://registry.domain.org', { http_proxy: 'https://proxy.local' }, {})
        .proxy
    ).toEqual('https://proxy.local');
  });
  test('main config invalid config key - http registry', () => {
    expect(
      getProxyInstance('http://registry.domain.org', { https_proxy: 'anything' }, {}).proxy
    ).toEqual(undefined);
  });
  test('main config invalid config key - https registry', () => {
    expect(
      getProxyInstance('https://registry.domain.org', { http_proxy: 'anything' }, {}).proxy
    ).toEqual(undefined);
  });

  test('uplink config - http registry, http proxy', () => {
    expect(
      getProxyInstance('http://registry.domain.org', {}, { http_proxy: 'http://proxy.local' }).proxy
    ).toEqual('http://proxy.local');
  });
  test('uplink config - http registry, https proxy', () => {
    expect(
      getProxyInstance('http://registry.domain.org', {}, { http_proxy: 'https://proxy.local' })
        .proxy
    ).toEqual('https://proxy.local');
  });
  test('uplink config invalid config key - http registry', () => {
    expect(
      getProxyInstance('http://registry.domain.org', {}, { https_proxy: 'anything' }).proxy
    ).toEqual(undefined);
  });
  test('uplink config invalid config key - https registry', () => {
    expect(
      getProxyInstance('https://registry.domain.org', {}, { http_proxy: 'anything' }).proxy
    ).toEqual(undefined);
  });
});
