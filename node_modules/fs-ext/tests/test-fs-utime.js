
// Test these APIs as published in extension module 'fs-ext'
//
// fs.utime(path, 
//
// fs.utimeSync(path, 
//
// Synchronous utime(2). Throws an exception on error.

// Ideas for testing borrowed from bnoordhuis (Ben Noordhuis)


//TODO and Questions

//XXX Is it 'standard' for async calls to die with exceptions on bad
//  argument values, rather than calling the callback with the error?

//XXX Why doesn't event callback receive exit code value?
//  They do!  Just not documented!


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

var file_fd,
    result,
    err;


// Report on test results -  -  -  -  -  -  -  -  -  -  -  -

// Clean up and report on final success or failure of tests here
process.addListener('exit', function listen_for_exit(exit_code) {
  //if (debug_me) console.log('    exit_code  %j', exit_code);

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
  // Delete any prior copy of test data file(s)
  try {
    fs.unlinkSync(file_path);
  } catch (e) {
    // might not exist, that's okay.
  }
  
  try {
    fs.unlinkSync(file_path_not);
  } catch (e) {
    // might not exist, that's okay.
  }
}


function date2unixtime(date_val) {
  return Math.floor( date_val / 1000 );
}


function expect_ok(api_name, resource, err) {
  var fault_msg;

  get_times_seen(resource);

  if ( err ) {
    if ( err instanceof Error ) {
      fault_msg = api_name + '(): returned error ' + err.message;
    } else {
      fault_msg = api_name + '(): returned error ' + err;
    }
  } else if ( atime_seen == atime_old ) {
    fault_msg = api_name + '(): atime was unchanged';
  } else if ( mtime_seen == mtime_old ) {
    fault_msg = api_name + '(): mtime was unchanged';
  } else if ( atime_seen !== atime_req ) {
    fault_msg = api_name + '(): atime not correct result';
  } else if ( mtime_seen !== mtime_req ) {
    fault_msg = api_name + '(): mtime not correct result';
  }

  if ( ! fault_msg ) {
    tests_ok++;
    if (debug_me) console.log('        OK: ' + api_name );
  } else {
    //XXX Create array from arguments adding xtime_req, xtime_seen to end?
    console.log('FAILURE: ' + arguments.callee.name + ': ' + fault_msg);
    //if (debug_me) console.log('   ARGS: ', util.inspect(arguments));
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
    //if (debug_me) console.log('   ARGS: ', util.inspect(arguments));
  }
}



// Setup for testing    -  -  -  -  -  -  -  -  -  -  -  -


// Check whether this version of node.js has these APIs to test
//XXX Consider just exiting without error after displaying notices

tests_run++;
if ( typeof fs.utime !== 'function' ) {
  console.log('fs.utime API is missing'); 
} else {  
  tests_ok++;
}

tests_run++;
if ( typeof fs.utimeSync !== 'function' ) {
  console.log('fs.utimeSync API is missing');
} else {  
  tests_ok++;
}

// If any pre-checks and setup fail, quit before tests
if ( tests_run !== tests_ok ) {     
  process.exit(2);
}


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


var atime_old,    mtime_old,
    atime_req,    mtime_req,
    atime_seen,   mtime_seen;

function debug_show_times() {
  console.log('  atime/mtime old   %d  %d', atime_old,   mtime_old  );
  console.log('  atime/mtime reqd  %d  %d', atime_req,   mtime_req  );
  console.log('  atime/mtime seen  %d  %d', atime_seen,  mtime_seen );
}

function debug_show_times_long() {
//console.log('  atime old   %s', new Date( 1000 * atime_old));
//console.log('  mtime old   %s', new Date( 1000 * mtime_old));
  console.log('  atime reqd  %s', new Date( 1000 * atime_req));
  console.log('  mtime reqd  %s', new Date( 1000 * mtime_req));
  console.log('  atime seen  %s', new Date( 1000 * atime_seen));
  console.log('  mtime seen  %s', new Date( 1000 * mtime_seen));
  console.log('');
}
    
function get_times_seen(path) {
  var fs_stats = fs.statSync(path);
  atime_seen = date2unixtime(fs_stats.atime);
  mtime_seen = date2unixtime(fs_stats.mtime);
}

function setup_test_values( new_atime, new_mtime ) {
  atime_old = atime_seen;
  mtime_old = mtime_seen;
  atime_req = new_atime;
  mtime_req = new_mtime;
}

function check_results(test_path) {
  get_times_seen(test_path);
  console.log('  atime/mtime old   %d  %d', atime_old,   mtime_old  );
  console.log('  atime/mtime reqd  %d  %d', atime_req,   mtime_req  );
  console.log('  atime/mtime seen  %d  %d', atime_seen,  mtime_seen );
  assert.notStrictEqual(atime_seen, atime_old, api_name + '(): atime was unchanged');
  assert.notStrictEqual(mtime_seen, mtime_old, api_name + '(): mtime was unchanged');
  assert.strictEqual(atime_seen, atime_req,    api_name + '(): atime not correct result');
  assert.strictEqual(mtime_seen, mtime_req,    api_name + '(): mtime not correct result');
}


// Begin tests for utimeSync()
//
//    fs.utimeSync('foo' [, atime, mtime] )


get_times_seen(file_path);

if (debug_me) {
  console.log('');
  console.log('Time now is:  %s', new Date());
  console.log('');
  console.log('initial file times:');
  console.log('  atime old   %s', new Date( 1000 * atime_seen));
  console.log('  mtime old   %s', new Date( 1000 * mtime_seen));
  console.log('');
}


// Use wrong filename to get 'ENOENT' error                   

setup_test_values( 0, 0 );
tests_run++;
result = err = undefined;
try {
  result = fs.utimeSync(file_path_not, atime_req, mtime_req);
} catch (e) {
  err = e;
}
expect_errno('utimeSync', err, result, 'ENOENT');

// Reset 'previous' times as unchanged by failed call
atime_seen = mtime_seen = 0;


// Set to 'now' by omitting time arguments
setup_test_values( date2unixtime(new Date()), date2unixtime(new Date()));
tests_run++;
result = err = undefined;
try {
  result = fs.utimeSync(file_path);
} catch (e) {
  err = e;
}
expect_ok('utimeSync', file_path, err);
if (debug_me) debug_show_times_long();



// Set to specific constant seconds values

setup_test_values( 1306707599, 1303922297 );
tests_run++;
result = err = undefined;
try {
  result = fs.utimeSync(file_path, atime_req, mtime_req);
} catch (e) {
  err = e;
}
expect_ok('utimeSync', file_path, err);
if (debug_me) debug_show_times_long();


// Set to specific values derived from Date()

setup_test_values( date2unixtime(new Date('1999-01-01 01:01:00 UTC')),
                   date2unixtime(new Date('1999-01-01 01:01:01 UTC')));

tests_run++;
result = err = undefined;
try {
  result = fs.utimeSync(file_path, atime_req, mtime_req);
} catch (e) {
  err = e;
}
expect_ok('utimeSync', file_path, err);
if (debug_me) debug_show_times_long();


// Try what would be special signal values

setup_test_values( -1, -1 );
tests_run++;
result = err = undefined;
try {
  result = fs.utimeSync(file_path, atime_req, mtime_req);
} catch (e) {
  err = e;
}
expect_ok('utimeSync', file_path, err);
if (debug_me) debug_show_times_long();



// Begin tests for utime()

// Set to a specific Date value
setup_test_values( date2unixtime(new Date('1999-02-02 02:02:00 UTC')),
                   date2unixtime(new Date('1999-02-02 02:02:01 UTC')));
tests_run++;

fs.utime(file_path, atime_req, mtime_req, function(err){
  expect_ok('utime', file_path, err);
  if (debug_me) debug_show_times_long();

  // Set to 'now' 
  setup_test_values( date2unixtime(new Date()), 
                     date2unixtime(new Date()));
  tests_run++;

  fs.utime(file_path, atime_req, mtime_req, function(err){
    expect_ok('utime', file_path, err);
    if (debug_me) debug_show_times_long();

    // Use wrong filename to get 'ENOENT' error                   
    setup_test_values( date2unixtime(new Date('1999-01-01 01:01:00 UTC')),
                       date2unixtime(new Date('1999-01-01 01:01:01 UTC')));
    tests_run++;

    fs.utime(file_path_not, atime_req, mtime_req, function(err){
      expect_errno('utime', err, undefined, 'ENOENT');
      if (debug_me) debug_show_times_long();
      
      // Reset 'previous' times as unchanged by failed call
      atime_seen = mtime_seen = 0;
    });
  });
});
