
// Stress test these APIs as published in extension module 'fs-ext'
// Specifically, try to exercise any memory leaks by simple repetition.

// Test these APIs as published in extension module 'fs-ext'
//
// fs.utime(path [, atime, mtime] [, func] )
//
// fs.utimeSync(path [, atime, mtime] )
//
// Synchronous utime(2). Throws an exception on error.


// Ideas for testing borrowed from bnoordhuis (Ben Noordhuis)


//TODO and Questions


//  console.log( require.resolve('../fs-ext'));

var assert = require('assert'),
    path   = require('path'),
    util   = require('util'),
    fs     = require('../fs-ext');

var tests_ok = 0;
var tests_run = 0;

var debug_me = true;
    debug_me = false;

var tmp_dir = "/tmp",
    file_path     = path.join(tmp_dir, 'what.when.utime.test'),
    file_path_not = path.join(tmp_dir, 'what.not.utime.test');

var result,
    err;

var atime_old,    mtime_old,
    atime_req,    mtime_req,
    atime_seen,   mtime_seen;



// Report on test results -  -  -  -  -  -  -  -  -  -  -  -

// Clean up and report on final success or failure of tests here
process.addListener('exit', function listen_for_exit(exit_code) {
  //if (debug_me) console.log('    exit_code  %j', exit_code);

  console.log('');
  console.log('  After all testing:');
  display_memory_usage_now();
  console.log('    End time is %s', new Date());

  remove_file_wo_error(file_path);

  console.log('Tests run: %d     ok: %d', tests_run, tests_ok);

  if ( ! exit_code  &&  tests_ok !== tests_run ) {
    console.log('One or more subtests failed!');
    process.removeListener('exit', listen_for_exit);
    process.exit(1);
  }
});


// Test helpers -  -  -  -  -  -  -  -  -  -  -  -  -  -  -

function remove_file_wo_error(file_path) {
  try {
    fs.unlinkSync(file_path);
  } catch (e) {
    // might not exist, that's okay.
  }
}


function date2unixtime(date_val) {
  return Math.floor( date_val / 1000 );
}


function display_memory_usage_now() {
  var usage = process.memoryUsage();
  console.log('    memory:  heapUsed  %d      rss       %d', 
                                usage.heapUsed,  usage.rss);
  console.log('             heapTotal %d      vsize     %d', 
                                usage.heapTotal, usage.vsize);
}


function expect_value(api_name, err, value_seen, value_expected) {
  var fault_msg;

  if ( err ) {
    if ( err instanceof Error ) {
      fault_msg = api_name + '(): returned error ' + err.message;
    } else {
      fault_msg = api_name + '(): returned error ' + err;
    }
  } else {
    if ( value_seen !== value_expected ) {
      fault_msg = api_name + '(): wrong value ' + value_seen +
                                   '  (expecting ' + value_expected + ')';
    }
  }

  if ( ! fault_msg ) {
    tests_ok++;
    if (debug_me) console.log('        OK: %s() returned ', api_name, value_seen);
  } else {
    console.log('FAILURE: ' + arguments.callee.name + ': ' + fault_msg);
    console.log('   ARGS: ', util.inspect(arguments));
  }
}


function expect_errno(api_name, err, value_seen, expected_errno) {
  var fault_msg;

  if (debug_me) console.log('  expected_errno(err): ' + err );

  if ( err ) {
    if ( err instanceof Error ) {
      if ( err.code !== undefined ) {
        if ( err.code !== expected_errno ) {
            fault_msg = api_name + '(): returned wrong errno \'' + err.message +
                                      '\'  (expecting ' + expected_errno + ')';
          }
      } else {
        fault_msg = api_name + '(): returned wrong error \'' + err + '\'';
      }
    } else {
      fault_msg = api_name + '(): returned wrong error \'' + err + '\'';
    }
  } else {
    fault_msg = api_name + '(): expected errno \'' + expected_errno + 
                                 '\', but got result ' + value_seen;
  }

  if ( ! fault_msg ) {
    tests_ok++;
    if (debug_me) console.log(' FAILED OK: ' + api_name );
  } else {
    console.log('FAILURE: ' + arguments.callee.name + ': ' + fault_msg);
    if (debug_me) console.log('   ARGS: ', util.inspect(arguments));
  }
}


// Setup for testing    -  -  -  -  -  -  -  -  -  -  -  -

// We assume that test-fs-utime.js has run successfully before this 
// test and so we omit several duplicate tests.

// Delete any prior copy of test data file(s)
remove_file_wo_error(file_path);

// Create a new file
tests_run++;
try {
  var file_fd = fs.openSync(file_path, 'w');
  fs.closeSync(file_fd);
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

atime_req = mtime_req = date2unixtime(new Date());

// Repeat a successful utimeSync() call 
if( 1 ) {
  how_many_times = 1000000;
  //how_many_times = 4;

  for( var i=0 ; i<how_many_times ; i++ ) {
    tests_run++;
    result = err = undefined;
    result = fs.utimeSync(file_path, atime_req, mtime_req);
    expect_value('utimeSync', err, result, undefined);
  }

  console.log('  After %d calls to successful utimeSync():', how_many_times);
  display_memory_usage_now();
  console.log('        Time is %s', new Date());
}


// Repeat an failing utimeSync() call 
if( 1 ) {
  how_many_times = 1000000;
  //how_many_times = 4;

  for( var i=0 ; i<how_many_times ; i++ ) {
    tests_run++;
    result = err = undefined;
    try {
      result = fs.utimeSync(file_path_not, atime_req, mtime_req);
    } catch (e) {
      err = e;
    }
    expect_errno('utimeSync', err, result, 'ENOENT');
////tests_ok++;
  }

  console.log('  After %d calls to failing utimeSync():', how_many_times);
  display_memory_usage_now();
  console.log('        Time is %s', new Date());
}



// Repeat a successful utime() call 
if (1) {
  how_many_times = 1000000;
  //how_many_times = 4;
  how_many_done  = 0;
 
  tests_run++;
  fs.utime(file_path, 0, 0, function func_good_utime_cb(err, result){
    expect_value('utime', err, result, undefined);
    if (debug_me) console.log('    utime call counter   %d', how_many_times );

    how_many_done += 1;
    if ( how_many_done < how_many_times ) {
      tests_run++;
      fs.utime(file_path, 0, 0, func_good_utime_cb );
      return;
    }
    console.log('  After %d calls to successful utime():', how_many_times);
    display_memory_usage_now();
    console.log('        Time is %s', new Date());

    test_failing_utime();
  });
} else {
  test_failing_utime();
}  


function test_failing_utime() {

  if (1) {
    how_many_times = 1000000;
    //how_many_times = 4;
    how_many_done  = 0;
 
    tests_run++;
    fs.utime(file_path_not, 0, 0, function func_good_utime_cb(err, result){
      expect_errno('utime', err, result, 'ENOENT');
      if (debug_me) console.log('    utime call counter   %d', how_many_times );

      how_many_done += 1;
      if ( how_many_done < how_many_times ) {
        tests_run++;
        fs.utime(file_path_not, 0, 0, func_good_utime_cb );
        return;
      }
      console.log('  After %d calls to failing utime():', how_many_times);
      display_memory_usage_now();
      console.log('        Time is %s', new Date());
    });
  }

}




