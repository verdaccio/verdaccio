'use strict';

const touch = require('touch');
const assert = require('assert');
const LocalData = require('../../src/lib/storage/local/local-data');
let Search = require('../../src/lib/search');
let Storage = require('../../src/lib/storage');
let config_hash = require('./partials/config');
let Config = require('../../src/lib/config');

require('../../src/lib/logger').setup([]);

let packages = [
	{
		name: 'test1',
		description: 'description',
		_npmUser: {
			name: 'test_user',
		},
	},
	{
		name: 'test2',
		description: 'description',
		_npmUser: {
			name: 'test_user',
		},
	},
	{
		name: 'test3',
		description: 'description',
		_npmUser: {
			name: 'test_user',
		},
	},
];

describe('search', function() {
	before(function() {
		let config = new Config(config_hash);
		this.storage = new Storage(config);
		Search.configureStorage(this.storage);
		packages.map(function(item) {
			Search.add(item);
		});
	});

	it('search query item', function() {
		let result = Search.query('t');
		assert(result.length === 3);
	});

	it('search remove item', function() {
		let item = {
			name: 'test6',
			description: 'description',
			_npmUser: {
				name: 'test_user',
			},
		};
		Search.add(item);
		let result = Search.query('test6');
		assert(result.length === 1);
		Search.remove(item.name);
		result = Search.query('test6');
		assert(result.length === 0);
	});

	it('should reindex when database file is touched', (done) => {
		let item = {
			name: 'test6',
			description: 'description',
			_npmUser: {
				name: 'test_user',
			},
		};
		Search.add(item);
		let result = Search.query('test6');
		assert(result.length === 1);
		Search.storage.localStorage.localList.on('data', (data) => {
			// The index should have been rebuilt.
			let result = Search.query('test6');
			assert(result.length === 0);
			done();
		});
		touch.sync(config_hash.storage);
	}).timeout(LocalData.DEFAULT_WATCH_POLL_INTERVAL + 100);
});
