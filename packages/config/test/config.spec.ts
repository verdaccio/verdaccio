import { isObject } from 'lodash-es';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  Config,
  DEFAULT_REGISTRY,
  DEFAULT_UPLINK,
  ROLES,
  TOKEN_VALID_LENGTH,
  WEB_TITLE,
  defaultSecurity,
  generateRandomSecretKey,
  getDefaultConfig,
  parseConfigFile,
} from '../src';
import { parseConfigurationFile } from './utils';

const resolveConf = (conf) => {
  const { name, ext } = path.parse(conf);

  return path.join(
    import.meta.dirname,
    `../src/conf/${name}${ext.startsWith('.') ? ext : '.yaml'}`
  );
};

const checkDefaultUplink = (config) => {
  expect(isObject(config.uplinks[DEFAULT_UPLINK])).toBeTruthy();
  expect(config.uplinks[DEFAULT_UPLINK].url).toMatch(DEFAULT_REGISTRY);
};

describe('check basic content parsed file', () => {
  const checkDefaultConfPackages = (config) => {
    // auth
    expect(isObject(config.auth)).toBeTruthy();
    expect(isObject(config.auth.htpasswd)).toBeTruthy();
    expect(config.auth.htpasswd.file).toMatch(/htpasswd/);

    // web
    expect(isObject(config.web)).toBeTruthy();
    expect(config.web.title).toBe(WEB_TITLE);
    expect(config.web.enable).toBeUndefined();

    // packages
    expect(isObject(config.packages)).toBeTruthy();
    expect(Object.keys(config.packages).join('|')).toBe('@*/*|**');
    expect(config.packages['@*/*'].access).toBeDefined();
    expect(config.packages['@*/*'].access).toContainEqual(ROLES.$ALL);
    expect(config.packages['@*/*'].publish).toBeDefined();
    expect(config.packages['@*/*'].publish).toContainEqual(ROLES.$AUTH);
    expect(config.packages['@*/*'].proxy).toBeDefined();
    expect(config.packages['@*/*'].proxy).toContainEqual(DEFAULT_UPLINK);
    expect(config.packages['**'].access).toBeDefined();
    expect(config.packages['**'].access).toContainEqual(ROLES.$ALL);
    expect(config.packages['**'].publish).toBeDefined();
    expect(config.packages['**'].publish).toContainEqual(ROLES.$AUTH);
    expect(config.packages['**'].proxy).toBeDefined();
    expect(config.packages['**'].proxy).toContainEqual(DEFAULT_UPLINK);
    // uplinks
    expect(config.uplinks[DEFAULT_UPLINK]).toBeDefined();
    expect(config.uplinks[DEFAULT_UPLINK].url).toEqual(DEFAULT_REGISTRY);
    // audit
    expect(config.middlewares).toBeDefined();
    expect(config.middlewares.audit).toBeDefined();
    expect(config.middlewares.audit.enabled).toBeTruthy();
    // log
    expect(config.log).toBeDefined();
    expect(config.log.type).toEqual('stdout');
    expect(config.log.format).toEqual('pretty');
    expect(config.log.level).toEqual('http');
    // must not be enabled by default
    expect(config.notify).toBeUndefined();
    expect(config.store).toBeUndefined();
    expect(config.publish).toBeUndefined();
    expect(config.url_prefix).toBeUndefined();
    expect(config.url_prefix).toBeUndefined();

    expect(config.experiments).toBeUndefined();
    expect(config.security).toEqual(defaultSecurity);
    // server settings
    expect(config.server).toBeDefined();
    expect(config.server.dotfiles).toEqual('ignore');
    expect(config.server.legacyAuthCache).toEqual({
      enabled: false,
      maxEntries: 1000,
      ttlMs: 30000,
    });
    // hideStaticLogs is not set in default config, defaults to true at runtime
    expect(config.server.hideStaticLogs).toBeUndefined();
  };

  test('parse default.yaml', () => {
    const config = new Config(getDefaultConfig());
    checkDefaultUplink(config);
    expect(config.storage).toBe('./storage');
    expect(config.auth.htpasswd.file).toBe('./htpasswd');
    checkDefaultConfPackages(config);
  });

  test('parse docker.yaml', () => {
    const config = new Config(getDefaultConfig('docker.yaml'));
    checkDefaultUplink(config);
    expect(config.storage).toBe('/verdaccio/storage/data');
    expect(config.auth.htpasswd.file).toBe('/verdaccio/storage/htpasswd');
    checkDefaultConfPackages(config);
  });

  test('should keep legacy auth cache disabled by default when partially configured', () => {
    const config = new Config({
      ...getDefaultConfig(),
      server: { legacyAuthCache: { maxEntries: 50 } },
    });

    expect(config.server.legacyAuthCache).toEqual({
      enabled: false,
      maxEntries: 50,
      ttlMs: 30000,
    });
  });

  test('should keep default rateLimit fields when partially overridden', () => {
    const config = new Config({
      ...getDefaultConfig(),
      server: { rateLimit: { max: 100 } },
    });

    // a partial rateLimit override keeps the default windowMs instead of dropping it
    expect(config.server.rateLimit).toEqual({ windowMs: 1000, max: 100 });
  });
});

describe('flags', () => {
  test('should default every flag to false', () => {
    const config = new Config(getDefaultConfig());

    expect(config.flags).toEqual({
      changePassword: false,
      createUser: false,
      stage: false,
      tfa: false,
      webLogin: false,
    });
  });

  test('should keep the other flags disabled when one is opted in', () => {
    const config = new Config({ ...getDefaultConfig(), flags: { stage: true } });

    expect(config.flags).toEqual({
      changePassword: false,
      createUser: false,
      stage: true,
      tfa: false,
      webLogin: false,
    });
  });

  test('should enable stage and tfa independently', () => {
    const config = new Config({ ...getDefaultConfig(), flags: { stage: true, tfa: true } });

    expect(config.flags.stage).toBe(true);
    expect(config.flags.tfa).toBe(true);
  });
});

describe('checkSecretKey', () => {
  test('with default.yaml and pre selected secret', () => {
    const config = new Config(parseConfigFile(resolveConf('default')));
    expect(config.checkSecretKey(generateRandomSecretKey())).toHaveLength(TOKEN_VALID_LENGTH);
  });

  test('with default.yaml and void secret', () => {
    const config = new Config(parseConfigFile(resolveConf('default')));
    const secret = config.checkSecretKey();
    expect(typeof secret === 'string').toBeTruthy();
    expect(secret).toHaveLength(TOKEN_VALID_LENGTH);
  });

  test('with default.yaml and empty string secret', () => {
    const config = new Config(parseConfigFile(resolveConf('default')));
    const secret = config.checkSecretKey('');
    expect(typeof secret === 'string').toBeTruthy();
    expect(secret).toHaveLength(TOKEN_VALID_LENGTH);
  });

  test('with default.yaml and valid string secret length', () => {
    const config = new Config(parseConfigFile(resolveConf('default')));
    expect(typeof config.checkSecretKey(generateRandomSecretKey()) === 'string').toBeTruthy();
  });

  test('should throw with invalid secret key length', () => {
    const config = new Config(parseConfigFile(resolveConf('default')));
    expect(() =>
      config.checkSecretKey('b4982dbb0108531fafb552374d7e83724b6458a2b3ffa97ad0edb899bdaefc4a')
    ).toThrow('Invalid storage secret key length');
  });

  test('should throw with short secret key length', () => {
    const config = new Config(parseConfigFile(resolveConf('default')));
    expect(() => config.checkSecretKey('tooshort')).toThrow('Invalid storage secret key length');
  });
});

describe('getMatchedPackagesSpec', () => {
  test('should match with react as defined in config file - react', () => {
    const configParsed = parseConfigFile(parseConfigurationFile('config-getMatchedPackagesSpec'));
    const config = new Config(configParsed);
    expect(config.getMatchedPackagesSpec('react')).toEqual({
      access: ['admin'],
      proxy: ['facebook'],
      publish: ['admin'],
      unpublish: false,
    });
  });

  test('should not match with react as defined in config file - somePackage', () => {
    const configParsed = parseConfigFile(parseConfigurationFile('config-getMatchedPackagesSpec'));
    const config = new Config(configParsed);
    expect(config.getMatchedPackagesSpec('somePackage')).toEqual({
      access: [ROLES.$ALL],
      proxy: ['npmjs'],
      publish: [ROLES.$AUTH],
      unpublish: false,
    });
  });
});

describe('VERDACCIO_STORAGE_PATH', () => {
  test('should set storage to value set in VERDACCIO_STORAGE_PATH environment variable', () => {
    const storageLocation = '/tmp/verdaccio';
    process.env.VERDACCIO_STORAGE_PATH = storageLocation;
    const config = new Config(parseConfigFile(resolveConf('default')));
    expect(config.storage).toBe(storageLocation);
    delete process.env.VERDACCIO_STORAGE_PATH;
  });

  test('should set storage path to VERDACCIO_STORAGE_PATH if both config and env are set', () => {
    const storageLocation = '/tmp/verdaccio';
    process.env.VERDACCIO_STORAGE_PATH = storageLocation;
    const config = new Config(parseConfigFile(parseConfigurationFile('storage')));
    expect(config.storage).toBe(storageLocation);
    delete process.env.VERDACCIO_STORAGE_PATH;
  });

  test('should take storage from environment variable if not exists in configs', () => {
    const storageLocation = '/tmp/verdaccio';
    process.env.VERDACCIO_STORAGE_PATH = storageLocation;
    const defaultConfig = parseConfigFile(resolveConf('default'));
    delete defaultConfig.storage;
    const config = new Config(defaultConfig);
    expect(config.storage).toBe(storageLocation);
    delete process.env.VERDACCIO_STORAGE_PATH;
  });
});

describe('configPath', () => {
  test('should set configPath in config', () => {
    const defaultConfig = parseConfigFile(resolveConf('default'));
    const config = new Config(defaultConfig);
    expect(config.getConfigPath()).toBe(path.join(import.meta.dirname, '../src/conf/default.yaml'));
  });

  test('should throw an error if configPath is not provided', () => {
    const defaultConfig = parseConfigFile(resolveConf('default'));
    defaultConfig.configPath = '';
    defaultConfig.config_path = '';
    expect(() => new Config(defaultConfig)).toThrow('configPath property is required');
  });
});
