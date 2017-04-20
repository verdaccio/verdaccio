var assert = require('assert');
var Search = require('../../lib/search');
var Storage = require('../../lib/storage');
var config_hash = require('./partials/config');
var Config = require('../../lib/config');

require('../../lib/logger').setup([]);

var packages = [
	{
		name: 'test1',
		description: 'description',
		_npmUser: {
			name: 'test_user',
		}
	},
	{
		name: 'test2',
		description: 'description',
		_npmUser: {
			name: 'test_user',
		}
	},
	{
		name: 'test3',
		description: 'description',
		_npmUser: {
			name: 'test_user',
		}
	}
]

describe('search', function() {

	before(function() {
		var config  = Config(config_hash);
		this.storage = new Storage(config);
		Search.configureStorage(this.storage);
		packages.map(function(item) {
			Search.add(item);
		});
	});

	it('search query item', function() {
		var result = Search.query('t');
		assert(result.length === 3);
	});

	it('search remove item', function() {
		var item = {
			name: 'test6',
			description: 'description',
			_npmUser: {
				name: 'test_user',
			}
		};
		Search.add(item);
		var result = Search.query('test6');
		assert(result.length === 1);
		Search.remove(item.name);
		var result = Search.query('test6');
		assert(result.length === 0);
	});

});
