import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { setup } from '@verdaccio/logger';

import { loadPlugin } from '../src/plugin-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

setup([]);

describe('plugin loader', () => {
  const relativePath = path.join(__dirname, './partials/test-plugin-storage');
  const buildConf = (name) => {
    return {
      config_path: path.join(__dirname, './'),
      max_users: 0,
      auth: {
        [`${relativePath}/${name}`]: {},
      },
    };
  };

  describe('auth plugins', () => {
    test('testing auth valid plugin loader', async () => {
      const _config = buildConf('verdaccio-plugin');
      // @ts-ignore
      const plugins = await loadPlugin(_config, _config.auth, {}, function (plugin) {
        return plugin.authenticate || plugin.allow_access || plugin.allow_publish;
      });

      expect(plugins).toHaveLength(1);
    });

    test('testing storage valid plugin loader', async () => {
      const _config = buildConf('verdaccio-es6-plugin');
      // @ts-ignore
      const plugins = await loadPlugin(_config, _config.auth, {}, function (p) {
        return p.getPackageStorage;
      });

      expect(plugins).toHaveLength(1);
    });

    test('testing auth plugin invalid plugin', async () => {
      const _config = buildConf('invalid-plugin');
      await expect(
        loadPlugin(_config, _config.auth, {}, function (p) {
          return p.authenticate || p.allow_access || p.allow_publish;
        })
      ).rejects.toThrowError(/plugin does not have the right code structure/);
    });

    test('testing auth plugin invalid plugin sanityCheck', async () => {
      const _config = buildConf('invalid-plugin-sanity');
      // @ts-expect-error
      await expect(
        loadPlugin(_config, _config.auth, {}, function (plugin) {
          return plugin.authenticate || plugin.allow_access || plugin.allow_publish;
        })
      ).rejects.toThrowError(/is not a valid plugin/);
    });

    test('testing auth plugin no plugins', async () => {
      const _config = buildConf('invalid-package');
      await expect(
        loadPlugin(_config, _config.auth, {}, function (plugin) {
          return plugin.authenticate || plugin.allow_access || plugin.allow_publish;
        })
      ).rejects.toThrowError(/plugin does not have the right code structure/);
    });

    // test.todo('test middleware plugins');
    // test.todo('test storage plugins');
  });
});
