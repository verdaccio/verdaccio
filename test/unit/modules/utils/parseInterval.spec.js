let assert = require('assert');
let parseInterval = require('../../../../src/lib/utils').parseInterval;

describe('Parse interval', () => {
  function add_test(str, res) {
    test('parse ' + str, () => {
      if (res === null) {
        assert.throws(function() {
          console.log(parseInterval(str));
        });
      } else {
        assert.strictEqual(parseInterval(str), res);
      }
    });
  }

  add_test(12345, 12345000);
  add_test('1000', 1000000);
  add_test('1.5s', 1500);
  add_test('25ms', 25);
  add_test('2m', 2*1000*60);
  add_test('3h', 3*1000*60*60);
  add_test('0.5d', 0.5*1000*60*60*24);
  add_test('0.5w', 0.5*1000*60*60*24*7);
  add_test('1M', 1000*60*60*24*30);
  add_test('5s 20ms', 5020);
  add_test('1y', 1000*60*60*24*365);
  add_test('1y 5', null);
  add_test('1m 1m', null);
  add_test('1m 1y', null);
  add_test('1y 1M 1w 1d 1h 1m 1s 1ms', 34822861001);
  add_test(' 5s  25ms  ', 5025);
});

