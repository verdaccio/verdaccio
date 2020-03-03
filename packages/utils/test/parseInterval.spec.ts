import assert from 'assert';
import { parseInterval } from '../src/utils';

describe('Parse interval', () => {
  function addTest(str, res) {
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

  addTest(12345, 12345000);
  addTest('1000', 1000000);
  addTest('1.5s', 1500);
  addTest('25ms', 25);
  addTest('2m', 2*1000*60);
  addTest('3h', 3*1000*60*60);
  addTest('0.5d', 0.5*1000*60*60*24);
  addTest('0.5w', 0.5*1000*60*60*24*7);
  addTest('1M', 1000*60*60*24*30);
  addTest('5s 20ms', 5020);
  addTest('1y', 1000*60*60*24*365);
  addTest('1y 5', null);
  addTest('1m 1m', null);
  addTest('1m 1y', null);
  addTest('1y 1M 1w 1d 1h 1m 1s 1ms', 34822861001);
  addTest(' 5s  25ms  ', 5025);
});

