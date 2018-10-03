import path from 'path';
import loadPlugin from '../../../src/lib/plugin-loader';
import logger from '../../../src/lib/logger';

logger.setup([]);

describe('plugin loader', () => {

  const relativePath = './partials/test-plugin-storage';
  const buildConf = name => {
    return {
      self_path: path.join(__dirname, './'),
      max_users: 0,
      auth: {
        [`${relativePath}/${name}`]: {}
      }
    };
  };

  describe('auth plugins', () => {
    test('testing auth valid plugin loader', () => {
      const _config = buildConf('verdaccio-plugin');
      const plugins = loadPlugin(_config, _config.auth, {}, function (plugin) {
        return plugin.authenticate || plugin.allow_access || plugin.allow_publish;
      });

      expect(plugins).toHaveLength(1);
    });

    test('testing storage valid plugin loader', () => {
      const _config = buildConf('verdaccio-es6-plugin');
      const plugins = loadPlugin(_config, _config.auth, {}, function (p) {
        return p.getPackageStorage;
      });

      expect(plugins).toHaveLength(1);
    });

    test('testing auth plugin invalid plugin', () => {
      const _config = buildConf('invalid-plugin');
      try {
        loadPlugin(_config, _config.auth, {}, function (p) {
          return p.authenticate || p.allow_access || p.allow_publish;
        });
      } catch(e) {
        expect(e.message).toEqual(`"${relativePath}/invalid-plugin" is not a valid plugin`);
      }
    });

    test('testing auth plugin invalid plugin sanityCheck', () => {
      const _config = buildConf('invalid-plugin-sanity');
      try {
        loadPlugin(_config, _config.auth, {}, function (plugin) {
          return plugin.authenticate || plugin.allow_access || plugin.allow_publish;
        });
      } catch(err) {
        expect(err.message).toEqual(`"${relativePath}/invalid-plugin-sanity" is not a valid plugin`);
      }
    });

    test('testing auth plugin no plugins', () => {
      const _config = buildConf('invalid-package');
      try {
        loadPlugin(_config, _config.auth, {}, function (plugin) {
          return plugin.authenticate || plugin.allow_access || plugin.allow_publish;
        });
      } catch(e) {
        expect(e.message).toMatch('plugin not found');
        expect(e.message).toMatch('/partials/test-plugin-storage/invalid-package');
      }
    });

    // FUTURE: the following groups should be here
    // middleware plugins
    // storage plugins

  });

});
