var immediate = require('./lib/index');

function bench (num, done) {
  var i = 1e3;
  var time = process.hrtime();
  function next(i) {
    var total = 50000;
    var todo = total;
    function nextInt1() {
      if (--todo !== 0) {
        return;
      }
      immediate(next, i -1);
    }
    function nextInt2() {
      if (--todo !== 0) {
        return;
      }
      immediate(next, i -1);
    }
    function nextInt3() {
      if (--todo !== 0) {
        return;
      }
      immediate(next, i -1);
    }
    function nextInt4() {
      if (--todo !== 0) {
        return;
      }
      immediate(next, i -1);
    }
    function nextInt5() {
      if (--todo !== 0) {
        return;
      }
      immediate(next, i -1);
    }
    if (i > 0) {
      var j = 0;
      while (j++ < total) {
        switch (j % 5) {
        case 0:
          immediate(nextInt1);
          break;
        case 1:
          immediate(nextInt2, 'arg');
          break;
        case 2:
          immediate(nextInt3, 'arg', 'another arg');
          break;
        case 3:
          immediate(nextInt4, 'arg', 'another arg', 'third arg');
          break;
        case 4:
          immediate(nextInt5, 'arg', 'another arg', 'third arg', '4th arg');
          break;
        }
      }
    } else {
      after();
    }
  }

  immediate(next, i);
  function after() {
    var diff = process.hrtime(time);
    var units = 'nanoseconds';
    var diftime = diff[0] * 1e9 + diff[1];
    if (diftime > 1e6) {
      diftime /= 1e6;
      units = 'milliseconds';
    }
    if (diftime > 1000) {
      diftime /= 1000;
      units = 'seconds';
    }
    console.log(`Benchmark ${num < 10 ? ('0' + num): num} took ${diftime.toFixed(4)} ${units}`);
    done(num);
  }
}
var runs = 20;
function afterRun(num) {
  if (num === runs) {
    return;
  }
  bench(num + 1, afterRun);
}
afterRun(0);
