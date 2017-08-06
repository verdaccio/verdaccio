'use strict';

const assert = require('assert');
const load_plugins = require('../../src/lib/plugin-loader').load_plugins;
const path = require('path');

describe('plugin loader', function() {

	it('testing auth valid plugin loader', function() {
		let _config = {
			self_path: path.join(__dirname, './'),
			max_users: 0,
			auth: {
				'./unit/partials/test-plugin-storage/verdaccio-plugin': {}
			}
		}
		let p = load_plugins(_config, _config.auth, {}, function (p) {
			return p.authenticate || p.allow_access || p.allow_publish;
		});
		assert(p.length === 1);
	});

	it('testing auth plugin invalid plugin', function() {
		let _config = {
			self_path: path.join(__dirname, './'),
			auth: {
				'./unit/partials/test-plugin-storage/invalid-plugin': {}
			}
		}
		try {
			load_plugins(_config, _config.auth, {}, function (p) {
				return p.authenticate || p.allow_access || p.allow_publish;
			});
		} catch(e) {
			assert(e.message === '"./unit/partials/test-plugin-storage/invalid-plugin" doesn\'t look like a valid plugin');
		}
	});

	it('testing auth plugin invalid plugin sanityCheck', function() {
		let _config = {
			self_path: path.join(__dirname, './'),
			auth: {
				'./unit/partials/test-plugin-storage/invalid-plugin-sanity': {}
			}
		}
		try {
			load_plugins(_config, _config.auth, {}, function (p) {
				return p.authenticate || p.allow_access || p.allow_publish;
			});
		} catch(e) {
			assert(e.message === '"./unit/partials/test-plugin-storage/invalid-plugin-sanity" doesn\'t look like a valid plugin');
		}
	});

	it('testing auth plugin no plugins', function() {
		let _config = {
			self_path: path.join(__dirname, './'),
			auth: {
				'./unit/partials/test-plugin-storage/invalid-package': {}
			}
		}
		try {
			load_plugins(_config, _config.auth, {}, function (p) {
				return p.authenticate || p.allow_access || p.allow_publish;
			});
		} catch(e) {
			assert(e.message === `"./unit/partials/test-plugin-storage/invalid-package" plugin not found\ntry "npm install verdaccio-./unit/partials/test-plugin-storage/invalid-package"`);
		}
	});

});
