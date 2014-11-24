var fs = require('./');

/**
 * Function that locks the current file
 * for `timeout` miliseconds
 *
 * The `counter` represents an index of how many
 * times the function has been called so far
 * (it acts as an id)
 *
 * The callback `cb` is optional
 */
function getCurrentFileSize(counter, timeout, cb) {
  var fd = fs.openSync(__filename, 'r');

  console.log("Trying to aquire lock for the %s time", counter);

  fs.flock(fd, 'exnb', function(err) {
    if (err) {
      return console.log("Couldn't lock file", counter);
    }

    console.log('Aquired lock', counter);

    // unlock after `timeout`
    setTimeout(function() {
      fs.flock(fd, 'un', function(err) {
        if (err) {
          return console.log("Couldn't unlock file", counter);
        }

        if (cb) { cb(); }
      });
    }, timeout);
  });
}

getCurrentFileSize(1, 300, function() {
  // this will succeed because we're calling the function
  // after unlock
  getCurrentFileSize(3, 2000);
});
// this will fail because #1 locks the file first
getCurrentFileSize(2, 1000);

// The output should be:
/*
Trying to aquire lock for the 1 time
Trying to aquire lock for the 2 time
Aquired lock 1
Couldn't lock file 2
Trying to aquire lock for the 3 time
Aquired lock 3
*/
