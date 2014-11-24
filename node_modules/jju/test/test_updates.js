var assert = require('assert')
  , fs = require('fs')
  , YAML = require('js-yaml')
  , jju = require('../')

function addTest(name, fn) {
	if (typeof(describe) === 'function') {
		it(name, fn)
	} else {
		fn()
	}
}

fs.readdirSync(__dirname + '/update').filter(function(file) {
	return file.match(/^[^\.].*\.yaml$/)
}).forEach(function(file) {
	addTest('update: ' + file, function() {
		var test = YAML.load(fs.readFileSync(__dirname + '/update/' + file, 'utf8'))
		assert.strictEqual(test.test(jju, test.input), test.output)
	})
})

