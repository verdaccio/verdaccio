import path from 'path';

import { Config, parseConfigFile } from '@verdaccio/config';
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

setup();

describe('plugin loader', () => {
  describe('file plugins', () => {
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
      const plugins = await asyncLoadPlugin(config.auth, { config, logger }, (p) => p.anyMethod);

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

  describe('npm plugins', () => {
    test('testing load auth npm package', async () => {
      const config = getConfig('npm-plugin-auth.yaml');
      const plugins = await asyncLoadPlugin(config.auth, { config, logger }, authSanitize);

      expect(plugins).toHaveLength(1);
    });

    test('testing load auth npm package invalid method check', async () => {
      const config = getConfig('npm-plugin-auth.yaml');
      const plugins = await asyncLoadPlugin(config.auth, { config, logger }, (p) => p.anyMethod);

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
});
