var assert         = require('assert')
var parse_interval = require('../../lib/config').parse_interval

describe('Parse interval', function() {
  function add_test(str, res) {
    it('parse ' + str, function() {
      if (res === null) {
        assert.throws(function() {
          console.log(parse_interval(str))
        })
      } else {
        assert.strictEqual(parse_interval(str), res)
      }
    })
  }

  add_test(12345, 12345000)
  add_test('1000', 1000000)
  add_test('1.5s', 1500)
  add_test('25ms', 25)
  add_test('2m', 2*1000*60)
  add_test('3h', 3*1000*60*60)
  add_test('0.5d', 0.5*1000*60*60*24)
  add_test('0.5w', 0.5*1000*60*60*24*7)
  add_test('1M', 1000*60*60*24*30)
  add_test('5s 20ms', 5020)
  add_test('1y', 1000*60*60*24*365)
  add_test('1y 5', null)
  add_test('1m 1m', null)
  add_test('1m 1y', null)
  add_test('1y 1M 1w 1d 1h 1m 1s 1ms', 34822861001)
  add_test(' 5s  25ms  ', 5025)
})

