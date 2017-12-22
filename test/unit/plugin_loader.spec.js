
import {loadPlugin} from '../../src/lib/plugin-loader';
import assert from 'assert';
import path from 'path';

require('../../src/lib/logger').setup([]);

describe('plugin loader', () => {

	test('testing auth valid plugin loader', () => {
		let _config = {
			self_path: path.join(__dirname, './'),
			max_users: 0,
			auth: {
				'./unit/partials/test-plugin-storage/verdaccio-plugin': {}
			}
		}
		let plugins = loadPlugin(_config, _config.auth, {}, function (p) {
			return p.authenticate || p.allow_access || p.allow_publish;
		});
		assert(plugins.length === 1);
	});

	test('testing auth plugin invalid plugin', () => {
		let _config = {
			self_path: path.join(__dirname, './'),
			auth: {
				'./unit/partials/test-plugin-storage/invalid-plugin': {}
			}
		}
		try {
			loadPlugin(_config, _config.auth, {}, function (p) {
				return p.authenticate || p.allow_access || p.allow_publish;
			});
		} catch(e) {
			assert(e.message === '"./unit/partials/test-plugin-storage/invalid-plugin" doesn\'t look like a valid plugin');
		}
	});

	test('testing auth plugin invalid plugin sanityCheck', () => {
		let _config = {
			self_path: path.join(__dirname, './'),
			auth: {
				'./unit/partials/test-plugin-storage/invalid-plugin-sanity': {}
			}
		}
		try {
			loadPlugin(_config, _config.auth, {}, function (plugin) {
				return plugin.authenticate || plugin.allow_access || plugin.allow_publish;
			});
		} catch(err) {
			assert(err.message === '"./unit/partials/test-plugin-storage/invalid-plugin-sanity" doesn\'t look like a valid plugin');
		}
	});

	test('testing auth plugin no plugins', () => {
		let _config = {
			self_path: path.join(__dirname, './'),
			auth: {
				'./unit/partials/test-plugin-storage/invalid-package': {}
			}
		}
		try {
			loadPlugin(_config, _config.auth, {}, function (plugin) {
				return plugin.authenticate || plugin.allow_access || plugin.allow_publish;
			});
		} catch(e) {
			assert(e.message === `"./unit/partials/test-plugin-storage/invalid-package" plugin not found\ntry "npm install verdaccio-./unit/partials/test-plugin-storage/invalid-package"`);
		}
	});

});
