var assert = require('assert')
  , merge = require('../lib/storage')._merge_versions

//require('../lib/logger').setup()

exports['Merge'] = {
	'simple': function() {
		var x = {
			versions: {a:1,b:1,c:1},
			'dist-tags': {},
		}
		merge(x, {versions: {a:2,q:2}})
		assert.deepEqual(x, {
			versions: {a:1,b:1,c:1,q:2},
			'dist-tags': {},
		})
	},

	'dist-tags - compat': function() {
		var x = {
			versions: {},
			'dist-tags': {q:'1.1.1',w:['2.2.2']},
		}
		merge(x, {'dist-tags':{q:'2.2.2',w:'3.3.3',t:'4.4.4'}})
		assert.deepEqual(x, {
			versions: {},
			'dist-tags': {q:['1.1.1','2.2.2'],w:['2.2.2','3.3.3'],t:['4.4.4']},
		})
	},

	'dist-tags - sort': function() {
		var x = {
			versions: {},
			'dist-tags': {w:['2.2.2','1.1.1','12.2.2','2.2.2-rc2']},
		}
		merge(x, {'dist-tags':{w:'3.3.3'}})
		assert.deepEqual(x, {
			versions: {},
			'dist-tags': {w:["1.1.1","2.2.2-rc2","2.2.2","3.3.3","12.2.2"]},
		})
	},
}

