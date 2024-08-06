import path from 'path';
import { describe, expect, test } from 'vitest';

import { Config, parseConfigFile } from '@verdaccio/config';
import { pluginUtils } from '@verdaccio/core';
import { logger, setup } from '@verdaccio/logger';

import { asyncLoadPlugin } from '../src/plugin-async-loader';

function getConfig(file: string) {
  const conPath = path.join(__dirname, './partials/config', file);
  return new Config(parseConfigFile(conPath));
}

const authSanitize = function (plugin) {
  return plugin.authenticate || plugin.allow_access || plugin.allow_publish;
};

const pluginsPartialsFolder = path.join(__dirname, './partials/test-plugin-storage');

setup({});

describe('plugin loader', () => {
  describe('file plugins', () => {
    describe('absolute path', () => {
      test('testing auth valid plugin loader', async () => {
        const config = getConfig('valid-plugin.yaml');
        config.plugins = pluginsPartialsFolder;
        const plugins = await asyncLoadPlugin(config.auth, { config, logger }, authSanitize);

        expect(plugins).toHaveLength(1);
      });

      test('should handle does not exist plugin folder', async () => {
        const config = getConfig('plugins-folder-fake.yaml');
        const plugins = await asyncLoadPlugin(
          config.auth,
          { logger: logger, config: config },
          authSanitize
        );

        expect(plugins).toHaveLength(0);
      });

      test('testing load auth npm package invalid method check', async () => {
        const config = getConfig('valid-plugin.yaml');
        config.plugins = pluginsPartialsFolder;
        const plugins = await asyncLoadPlugin<pluginUtils.Auth<unknown>>(
          config.auth,
          { config, logger },
          // @ts-expect-error
          (p) => typeof p.somethingFake !== 'undefined'
        );

        expect(plugins).toHaveLength(0);
      });

      test('should fails if plugins folder is not a directory', async () => {
        const config = getConfig('plugins-folder-fake.yaml');
        // force file instead a folder.
        config.plugins = path.join(__dirname, 'just-a-file.js');
        const plugins = await asyncLoadPlugin(
          config.auth,
          { logger: logger, config: config },
          authSanitize
        );

        expect(plugins).toHaveLength(0);
      });
    });
    describe('relative path', () => {
      test('should resolve plugin based on relative path', async () => {
        const config = getConfig('relative-plugins.yaml');
        // force file instead a folder.
        const plugins = await asyncLoadPlugin(
          config.auth,
          { logger: logger, config: config },
          authSanitize
        );

        expect(plugins).toHaveLength(1);
      });

      test('should fails if config path is missing', async () => {
        const config = getConfig('relative-plugins.yaml');
        // @ts-expect-error
        config.configPath = undefined;
        // @ts-expect-error
        config.config_path = undefined;
        // force file instead a folder.
        const plugins = await asyncLoadPlugin(
          config.auth,
          { logger: logger, config: config },
          authSanitize
        );

        expect(plugins).toHaveLength(0);
      });

      // config.config_path is not considered for loading plugins due legacy support
      test('should fails if config path is missing (only config_path)', async () => {
        const config = getConfig('relative-plugins.yaml');
        // @ts-expect-error
        config.configPath = undefined;
        // force file instead a folder.
        const plugins = await asyncLoadPlugin(
          config.auth,
          { logger: logger, config: config },
          authSanitize
        );

        expect(plugins).toHaveLength(0);
      });
    });
  });

  describe('npm plugins', () => {
    test('testing load auth npm package', async () => {
      const config = getConfig('npm-plugin-auth.yaml');
      const plugins = await asyncLoadPlugin(config.auth, { config, logger }, authSanitize);

      expect(plugins).toHaveLength(1);
    });

    test('should handle not found installed package', async () => {
      const config = getConfig('npm-plugin-not-found.yaml');
      const plugins = await asyncLoadPlugin<pluginUtils.Auth<unknown>>(
        config.auth,
        { config, logger },
        (p) => typeof p.authenticate !== 'undefined'
      );

      expect(plugins).toHaveLength(0);
    });

    test('testing load auth npm package invalid method check', async () => {
      const config = getConfig('npm-plugin-auth.yaml');
      const plugins = await asyncLoadPlugin<pluginUtils.Auth<unknown>>(
        config.auth,
        { config, logger },
        // @ts-expect-error
        (p) => typeof p.somethingFake !== 'undefined'
      );

      expect(plugins).toHaveLength(0);
    });

    test('testing load auth npm package custom prefix', async () => {
      const config = getConfig('custom-prefix-auth.yaml');
      const plugins = await asyncLoadPlugin(
        config.auth,
        { config, logger },
        authSanitize,
        'customprefix'
      );

      expect(plugins).toHaveLength(1);
    });

    test('testing load auth scope npm package', async () => {
      const config = getConfig('scope-auth.yaml');
      const plugins = await asyncLoadPlugin(config.auth, { config, logger }, authSanitize);
      expect(plugins).toHaveLength(1);
    });
  });

  describe('fallback plugins', () => {
    test('should fallback to npm package if does not find on plugins folder', async () => {
      const config = getConfig('npm-plugin-auth.yaml');
      config.plugins = pluginsPartialsFolder;
      const plugins = await asyncLoadPlugin(config.auth, { config, logger }, authSanitize);

      expect(plugins).toHaveLength(1);
    });

    test('should fallback to npm package if plugins folder does not exist', async () => {
      const config = getConfig('npm-plugin-auth.yaml');
      config.plugins = '/does-not-exist';
      const plugins = await asyncLoadPlugin(config.auth, { config, logger }, authSanitize);

      expect(plugins).toHaveLength(1);
    });
  });
});
