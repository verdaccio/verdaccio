import { describe, expect, test } from 'vitest';

import { maskPath, parseVersion } from '../src/commands/env-info';

describe('parseVersion', () => {
  test.each([
    ['v24.20.0', '24.20.0'],
    ['11.19.0', '11.19.0'],
    ['Docker version 29.2.1, build abc123', '29.2.1'],
    ['1.22.22', '1.22.22'],
    ['9.0.0-next-9.30', '9.0.0-next-9.30'],
  ])('%s -> %s', (raw, expected) => {
    expect(parseVersion(raw)).toBe(expected);
  });
});

import { verdaccioConfigLines } from '../src/commands/env-info';
import type { ConfigYaml } from '@verdaccio/types';

describe('verdaccioConfigLines', () => {
  test('local filesystem storage plus plugins', () => {
    const lines = verdaccioConfigLines(
      {
        storage: '/data',
        auth: { htpasswd: {} },
        middlewares: { audit: {} },
      } as unknown as ConfigYaml,
      '/etc/verdaccio/config.yaml'
    );
    expect(lines).toContain('    config: /etc/verdaccio/config.yaml');
    expect(lines).toContain('    storage: local filesystem (/data)');
    expect(lines).toContain('    auth plugins: htpasswd');
    expect(lines).toContain('    middleware plugins: audit');
  });

  test('storage plugin and no auth plugins', () => {
    const lines = verdaccioConfigLines({
      store: { 'aws-s3-storage': {} },
    } as unknown as ConfigYaml);
    expect(lines).toContain('    storage: aws-s3-storage plugin');
    expect(lines).toContain('    auth plugins: (none)');
  });
});

describe('verdaccioConfigLines with mask', () => {
  test('masks the directories of the config and storage paths but keeps structure', () => {
    const lines = verdaccioConfigLines(
      { storage: '/secret/home/data/storage', auth: { htpasswd: {} } } as unknown as ConfigYaml,
      '/secret/home/verdaccio/config.yaml',
      true
    );
    expect(lines).toContain('    config: /**/**/**/config.yaml');
    expect(lines).toContain('    storage: local filesystem (/**/**/**/storage)');
    expect(lines.some((l) => l.includes('/secret/'))).toBe(false);
    expect(lines).toContain('    auth plugins: htpasswd');
  });
});

describe('maskPath', () => {
  test.each([
    ['/Users/verdaccio/.config/verdaccio/config.yaml', '/**/**/**/**/config.yaml'],
    ['/usr/local/bin/docker', '/**/**/**/docker'],
    ['relative/dir/file', '**/**/file'],
  ])('%s -> %s', (input, expected) => {
    expect(maskPath(input)).toBe(expected);
  });
});

describe('maskPath on windows-style paths', () => {
  test('masks backslash directories too', () => {
    expect(maskPath('C:\\Users\\verdaccio\\config.yaml')).toBe('**/**/**/config.yaml');
  });
});
