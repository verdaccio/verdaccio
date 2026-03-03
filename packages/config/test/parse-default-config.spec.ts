import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { getConfigParsed } from '../src';

describe('getConfigParsed with default configs', () => {
  const defaultConfigDir = path.join(__dirname, '../src/conf');

  test('parses default.yaml config', () => {
    const yamlFile = path.join(defaultConfigDir, 'default.yaml');
    const config = getConfigParsed(yamlFile);
    expect(config).toBeDefined();
    expect(config.storage).toBe('./storage');
    expect(config.auth.htpasswd.file).toBe('./htpasswd');
    expect(config.packages['@*/*'].access).toBe('$all');
    expect(config.packages['@*/*'].publish).toBe('$authenticated');
    expect(config.packages['@*/*'].proxy).toBe('npmjs');
    expect(config.packages['**'].access).toBe('$all');
    expect(config.packages['**'].publish).toBe('$authenticated');
    expect(config.packages['**'].proxy).toBe('npmjs');
    expect(config.uplinks['npmjs'].url).toBe('https://registry.npmjs.org/');
    expect(config.log?.type).toBe('stdout');
    expect(config.log?.format).toBe('pretty');
    expect(config.log?.level).toBe('http');
    expect(config.notify).toBeUndefined();
    expect(config.store).toBeUndefined();
    expect(config.url_prefix).toBeUndefined();
    expect(config.experiments).toBeUndefined();
  });

  test('parses docker.yaml config', () => {
    const yamlFile = path.join(defaultConfigDir, 'docker.yaml');
    const config = getConfigParsed(yamlFile);
    expect(config).toBeDefined();
    expect(config.storage).toBe('/verdaccio/storage/data');
    expect(config.auth.htpasswd.file).toBe('/verdaccio/storage/htpasswd');
    expect(config.packages['@*/*'].access).toBe('$all');
    expect(config.packages['@*/*'].publish).toBe('$authenticated');
    expect(config.packages['@*/*'].proxy).toBe('npmjs');
    expect(config.packages['**'].access).toBe('$all');
    expect(config.packages['**'].publish).toBe('$authenticated');
    expect(config.packages['**'].proxy).toBe('npmjs');
    expect(config.uplinks['npmjs'].url).toBe('https://registry.npmjs.org/');
    expect(config.log?.type).toBe('stdout');
    expect(config.log?.format).toBe('pretty');
    expect(config.log?.level).toBe('http');
    expect(config.notify).toBeUndefined();
    expect(config.store).toBeUndefined();
    expect(config.url_prefix).toBeUndefined();
    expect(config.experiments).toBeUndefined();
  });
});
