import path from 'path';
import { describe, expect, test, vi } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { TOKEN_BASIC, TOKEN_BEARER } from '@verdaccio/core';
import { Logger } from '@verdaccio/types';

import { IProxy } from '../src/index';
import { setupUpLinks } from '../src/uplink-util';

const getConf = (name) => path.join(__dirname, '/conf', name);

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

describe('setupUpLinks', () => {
  test('should create uplinks for each proxy configuration', () => {
    const proxyPath = getConf('multi-proxy.yaml');
    const config = new Config(parseConfigFile(proxyPath));

    const uplinks = setupUpLinks(config, logger);

    expect(Object.keys(uplinks)).toHaveLength(3);
    expect(uplinks).toHaveProperty('github');
    expect(uplinks).toHaveProperty('gitlab');
    expect(uplinks).toHaveProperty('npmjs');

    const githubProxy = uplinks.github as IProxy;
    expect(githubProxy.uplinkName).toBe('github');
    expect(githubProxy.config.auth).toEqual({
      type: TOKEN_BEARER,
      token: 'xxx123xxx',
    });

    const gitlabProxy = uplinks.gitlab as IProxy;
    expect(gitlabProxy.uplinkName).toBe('gitlab');
    expect(gitlabProxy.config.auth).toEqual({
      type: TOKEN_BASIC,
      token: 'xxx456xxx',
    });

    const npmjsProxy = uplinks.npmjs as IProxy;
    expect(npmjsProxy.uplinkName).toBe('npmjs');
    expect(npmjsProxy.config.auth).toBeUndefined();
  });
});
