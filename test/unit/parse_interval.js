var assert = require('assert')
  , parse_interval = require('../../lib/config').parse_interval

describe('Parse interval', function() {
	function add_test(str, res) {
		it('parse ' + str, function() {
			assert.strictEqual(parse_interval(str), res)
		})
	}

	add_test(12345, 12345)
	add_test('1000', 1000)
	add_test('1.5s', 1500)
	add_test('25ms', 25)
	add_test('2m', 2*1000*60)
	add_test('3h', 3*1000*60*60)
	add_test('0.5d', 0.5*1000*60*60*24)
	add_test('1M', 1000*60*60*24*30)
	add_test('1y', 1000*60*60*24*30*365.25)
})

