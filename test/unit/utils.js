var assert = require('assert')
  , validate = require('../../lib/utils').validate_name

exports['Validate'] = {
	'good ones': function() {
		assert(validate('sinopia'))
		assert(validate('some.weird.package-zzz'))
	},

	'uppercase': function() {
		assert(validate('EVE'))
		assert(validate('JSONStream'))
	},

	'no package.json': function() {
		assert(!validate('package.json'))
	},

	'no path seps': function() {
		assert(!validate('some/thing'))
		assert(!validate('some\\thing'))
	},
	
	'no hidden': function() {
		assert(!validate('.bin'))
	},
	
	'no reserved': function() {
		assert(!validate('favicon.ico'))
		assert(!validate('node_modules'))
		assert(!validate('__proto__'))
	},

	'other': function() {
		assert(!validate('pkg@'))
		assert(!validate('pk g'))
		assert(!validate('pk\tg'))
		assert(!validate('pk%20g'))
		assert(!validate('pk+g'))
		assert(!validate('pk:g'))
	},
}
