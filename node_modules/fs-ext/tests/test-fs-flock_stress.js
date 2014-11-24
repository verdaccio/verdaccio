
// Stress test these APIs as published in extension module 'fs-ext'
// Specifically, try to exercise any memory leaks by simple repetition.
//
// fs.flock(fd, flags, [callback])
//
// Asynchronous flock(2).  No arguments other than a possible error are 
// passed to the callback.  Flags can be 'sh', 'ex', 'shnb', 'exnb', 'un' 
// and correspond to the various LOCK_SH, LOCK_EX, LOCK_SH|LOCK_NB, etc.
//
// fs.flockSync(fd, flags)
//
// Synchronous flock(2). Throws an exception on error.

// Ideas for testing borrowed from bnoordhuis (Ben Noordhuis)



//TODO and Questions


//  console.log( require.resolve('../fs-ext'));

var assert = require('assert'),
    path   = require('path'),
    util   = require('util'),
    fs     = require('../fs-ext');

var tests_ok  = 0,
    tests_run = 0;

var debug_me = true;
    debug_me = false;

var tmp_dir = "/tmp",
    file_path     = path.join(tmp_dir, 'what.when.flock.test'),
    file_path_not = path.join(tmp_dir, 'what.not.flock.test');

var file_fd,
    err;


// Report on test results -  -  -  -  -  -  -  -  -  -  -  -

// Clean up and report on final success or failure of tests here
process.addListener('exit', function() {

  console.log('');
  console.log('  After all testing:');
  display_memory_usage_now();
  console.log('    End time is %s', new Date());

  try {
    fs.closeSync(file_fd);
  } catch (e) {
    // might not be open, that's okay.
  }

  remove_file_wo_error(file_path);

  console.log('Tests run: %d     ok: %d', tests_run, tests_ok);
  assert.equal(tests_ok, tests_run, 'One or more subtests failed');
});


// Test helpers -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

function remove_file_wo_error(file_path) {
  try {
    fs.unlinkSync(file_path);
  } catch (e) {
    // might not exist, that's okay.
  }
}

function display_memory_usage_now() {
  var usage = process.memoryUsage();
  console.log('    memory:  heapUsed  %d      rss       %d', 
                                usage.heapUsed,  usage.rss);
  console.log('             heapTotal %d      vsize     %d', 
                                usage.heapTotal, usage.vsize);
}

function expect_errno(api_name, resource, err, expected_errno) {
  var fault_msg;

  if (debug_me) console.log('  expected_errno(err): ' + err );

  if ( err  &&  err.code !== expected_errno ) {
      fault_msg = api_name + '(): expected error ' + expected_errno + ', got another error';
  } else if ( !err ) {
    fault_msg = api_name + '(): expected error ' + expected_errno + ', got another error';
  }

  if ( ! fault_msg ) {
    tests_ok++;
    if (debug_me) console.log(' FAILED OK: ' + api_name );
  } else {
    console.log('FAILURE: ' + arguments.callee.name + ': ' + fault_msg);
    console.log('   ARGS: ', util.inspect(arguments));
  }
}

function expect_ok(api_name, resource, err) {
  var fault_msg;

  if ( err ) {
    fault_msg = api_name + '(): returned error';
  }

  if ( ! fault_msg ) {
    tests_ok++;
    if (debug_me) console.log('        OK: ' + api_name );
  } else {
    console.log('FAILURE: ' + arguments.callee.name + ': ' + fault_msg);
    console.log('   ARGS: ', util.inspect(arguments));
    console.log('    err: %j', err );
  }
}


// Setup for testing    -  -  -  -  -  -  -  -  -  -  -  -

// We assume that test-fs-flock.js has run successfully before this 
// test and so we omit several duplicate tests.

// Delete any prior copy of test data file(s)
remove_file_wo_error(file_path);

// Create a new file
tests_run++;
try {
  file_fd = fs.openSync(file_path, 'w');
  tests_ok++;
} catch (e) {
  console.log('  Unable to create test data file %j', file_path);
  console.log('    Error was: %j', e);
}


if ( tests_run !== tests_ok ) {     
  process.exit(1);
}


// Stress testing    -  -  -  -  -  -  -  -  -  -  -  -  -

var how_many_times,
    how_many_secs,
    how_many_done;


console.log('  Start time is %s', new Date());
console.log('  Before any testing:');
display_memory_usage_now();
console.log('');


// Repeat a successful flockSync() call 
if( 1 ) {
  how_many_times = 10000000;
  //how_many_times = 1000000;
  //how_many_times = 4;

  for( var i=0 ; i<how_many_times ; i++ ) {
    tests_run++;
    err = fs.flockSync(file_fd, 'un');
    expect_ok('flockSync', file_fd, err);
  }

  console.log('  After %d calls to successful flockSync():', how_many_times);
  display_memory_usage_now();
  console.log('        Time is %s', new Date());
}


// Repeat a successful flock() call 
if( 1 ) {
  how_many_times = 1000000;
  //how_many_times = 100000;
  //how_many_times = 4;
  how_many_done  = 0;
 
  tests_run++;
  fs.flock(file_fd, 'un', function func_good_flock_cb(err){
    expect_ok('flock', file_fd, err);
    if (debug_me) console.log('    flock call counter   %d', how_many_times );

    how_many_done += 1;
    if ( how_many_done < how_many_times ) {
      tests_run++;
      fs.flock(file_fd, 'un', func_good_flock_cb );
      return;
    }
    console.log('  After %d calls to successful flock():', how_many_times);
    display_memory_usage_now();
    console.log('        Time is %s', new Date());

    test_failing_flock();
  });
} else {
  test_failing_flock();
}  

function test_failing_flock() {

  if (1) {
    how_many_times = 1000000;
    //how_many_times = 100000;
    //how_many_times = 4;
    how_many_done  = 0;
 
    tests_run++;
    fs.flock(-99, 'un', function func_good_flock_cb(err){
      expect_errno('flock', -99, err, 'EBADF');
      if (debug_me) console.log('    flock call counter   %d', how_many_times );

      how_many_done += 1;
      if ( how_many_done < how_many_times ) {
        tests_run++;
        fs.flock(-99, 'un', func_good_flock_cb );
        return;
      }
      console.log('  After %d calls to failing flock():', how_many_times);
      display_memory_usage_now();
      console.log('        Time is %s', new Date());
    });
  } else {
  }

}


