
// Test these APIs as published in extension module 'fs-ext'
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

//XXX Is it 'standard' for async calls to die with exceptions on bad
//  argument values, rather than calling the callback with the error?


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
  }
}


// Setup for testing    -  -  -  -  -  -  -  -  -  -  -  -

// Check whether this version of node.js has these APIs to test
//XXX Consider just exiting without error after displaying notices

tests_run++;
if ( typeof fs.flock !== 'function' ) {
  console.log('fs.flock API is missing'); 
} else {  
  tests_ok++;
}

tests_run++;
if ( typeof fs.flockSync !== 'function' ) {
  console.log('fs.flockSync API is missing');
} else {  
  tests_ok++;
}


// If any pre-checks and setup fail, quit before tests
if ( tests_run !== tests_ok ) {     
  process.exit(1);
}

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


// Test that constants are published -  -  -  -  -  -  -  - 

var fs_binding = require('../build/Release/fs-ext');

var constant_names = [ 'LOCK_EX',  'LOCK_NB',  'LOCK_SH',  'LOCK_UN' ];

constant_names.forEach(function(name){

  if (debug_me) console.log('  %s    %j    %j', name, fs_binding[name], typeof fs_binding[name]);

  tests_run++;
  if ( fs_binding[name] !== undefined  &&
     typeof fs_binding[name] === 'number' ) {
    tests_ok++;
  } else {
    console.log('FAILURE: %s is not defined correctly', name);  
    console.log('  %s    %j    %j', name, fs_binding[name], typeof fs_binding[name]);
  }
});


// Test bad argument handling   -  -  -  -  -  -  -  -  -  -  -

// fd value is undefined 

tests_run++;
try {
  err = fs.flockSync(undefined, 'un');
} catch (e) {
  err = e;
}

if (err) {
  if (debug_me) console.log('    err    %j', err);
  tests_ok++;
} else {
  if (debug_me) console.log('    expected error from undefined fd argument');
}


// fd value is non-number 

tests_run++;
try {
  err = fs.flockSync('foo', 'un');
} catch (e) {
  err = e;
}

if (err) {
  if (debug_me) console.log('    err    %j', err);
  tests_ok++;
} else {
  if (debug_me) console.log('    expected error from non-numeric fd argument');
}


// fd value is negative 

tests_run++;
try {
  err = fs.flockSync(-9, 'un');
} catch (e) {
  err = e;
}
expect_errno('flockSync', -9, err, 'EBADF');


// fd value is 'impossible' 

tests_run++;
try {
  err = fs.flockSync(98765, 'un');
} catch (e) {
  err = e;
}
expect_errno('flockSync', 98765, err, 'EBADF');


// flags value is invalid
// Flags can be 'sh', 'ex', 'shnb', 'exnb', 'un'.


tests_run++;
try {
  err = fs.flockSync(file_fd, 'foo');
} catch (e) {
  err = e;
}

//    "message": "Unknown flock flag: foo" 
if (err) {
  if (debug_me) console.log('    err    %j', err);
  tests_ok++;
} else {
  if (debug_me) console.log('    expected error from non-numeric fd argument');
}


// Test valid calls: flockSync  -  -  -  -  -  -  -  -  -  - 

// Flags can be 'sh', 'ex', 'shnb', 'exnb', 'un'.

// operation LOCK_UN: 'un'

tests_run++;
try {
  err = fs.flockSync(file_fd, 'un');
} catch (e) {
  err = e;
}
expect_ok('flockSync', file_fd, err);


// operation LOCK_UN: 'sh' then 'un'

tests_run++;
try {
  err = fs.flockSync(file_fd, 'sh');
} catch (e) {
  err = e;
}
expect_ok('flockSync', file_fd, err);

tests_run++;
try {
  err = fs.flockSync(file_fd, 'un');
} catch (e) {
  err = e;
}
expect_ok('flockSync', file_fd, err);


// operation LOCK_UN: 'ex' then 'un'

tests_run++;
try {
  err = fs.flockSync(file_fd, 'ex');
} catch (e) {
  err = e;
}
expect_ok('flockSync', file_fd, err);

tests_run++;
try {
  err = fs.flockSync(file_fd, 'un');
} catch (e) {
  err = e;
}
expect_ok('flockSync', file_fd, err);


// operation LOCK_UN: 'shnb' then 'un'

tests_run++;
try {
  err = fs.flockSync(file_fd, 'shnb');
} catch (e) {
  err = e;
}
expect_ok('flockSync', file_fd, err);

tests_run++;
try {
  err = fs.flockSync(file_fd, 'un');
} catch (e) {
  err = e;
}
expect_ok('flockSync', file_fd, err);


// operation LOCK_UN: 'exnb' then 'un'

tests_run++;
try {
  err = fs.flockSync(file_fd, 'exnb');
} catch (e) {
  err = e;
}
expect_ok('flockSync', file_fd, err);

tests_run++;
try {
  err = fs.flockSync(file_fd, 'un');
} catch (e) {
  err = e;
}
expect_ok('flockSync', file_fd, err);




// Flags can be 'sh', 'ex', 'shnb', 'exnb', 'un'.



// Test valid calls: flock  -  -  -  -  -  -  -  -  -  -  - 

// SEEK_SET to 0

tests_run++;
  tests_run++;
fs.flock(file_fd, 'sh', function(err, extra) {
  expect_ok('flock', file_fd, err);

  // After a change to returning arguments to async callback routines,
  //   check that this API still receives only one argument.
  if ( extra === undefined ) {
        tests_ok++;
  } else {
    console.log('  async flock() callback received more than one argument');
  }

  tests_run++;
  fs.flock(file_fd, 'exnb', function(err) {
    expect_ok('flock', file_fd, err);

    tests_run++;
    fs.flock(file_fd, 'un', function(err) {
      expect_ok('flock', file_fd, err);

      // Test invalid calls: flock  -  -  -  -  -  -  -  -  - 

      // offset value is negative
      tests_run++;

      try {
        fs.flock(file_fd, 'foo', function(err) {
          console.log('  unexpected callback from flock() with bad argument');
        });
        err = undefined;
      } catch (e) {
        err = e;
      }
      //    "message": "Unknown flock flag: foo" 
      if (err) {
        if (debug_me) console.log('    err    %j', err);
        tests_ok++;
      } else {
        if (debug_me) console.log('  unexpected success  from flock() with bad argument');
      }
    });
  });
});


//------------------------------------------------------------------------------
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  
//
// Errors we have seen:
//
// err { "stack":   "TypeError: Bad argument\n    at Object.seekSync (/home/Tom/study/javascript/node.js/baudehlo-node-fs-ext-3a489b7_/fs-ext.js:80:18)\n    at Object.<anonymous> (/home/Tom/study/javascript/node.js/baudehlo-node-fs-ext-3a489b7_/tests/test-fs-seek.js:101:12)\n    at Module._compile (module.js:407:26)\n    at Object..js (module.js:413:10)\n    at Module.load (module.js:339:31)\n    at Function._load (module.js:298:12)\n    at Array.0 (module.js:426:10)\n    at EventEmitter._tickCallback (node.js:126:26)",
//       "message": "Bad argument"}
//
// err { "stack":   "Error: EBADF, Bad file descriptor\n    at Object.seekSync (/home/Tom/study/javascript/node.js/baudehlo-node-fs-ext-3a489b7_/fs-ext.js:80:18)\n    at Object.<anonymous> (/home/Tom/study/javascript/node.js/baudehlo-node-fs-ext-3a489b7_/tests/test-fs-seek.js:137:12)\n    at Module._compile (module.js:407:26)\n    at Object..js (module.js:413:10)\n    at Module.load (module.js:339:31)\n    at Function._load (module.js:298:12)\n    at Array.0 (module.js:426:10)\n    at EventEmitter._tickCallback (node.js:126:26)",
//       "message": "EBADF, Bad file descriptor",
//       "errno":   9,
//       "code":    "EBADF"}
//

// err after bad flags arg: {
//    "stack":   "Error: Unknown flock flag: foo\n    at stringToFlockFlags (/home/Tom/study/javascript/node.js/node-fs-ext/fs-ext.js:47:13)\n    at Object.flockSync (/home/Tom/study/javascript/node.js/node-fs-ext/fs-ext.js:65:14)\n    at Object.<anonymous> (/home/Tom/study/javascript/node.js/node-fs-ext/tests/test-fs-flock.js:237:12)\n    at Module._compile (module.js:407:26)\n    at Object..js (module.js:413:10)\n    at Module.load (module.js:339:31)\n    at Function._load (module.js:298:12)\n    at Array.0 (module.js:426:10)\n    at EventEmitter._tickCallback (node.js:126:26)",
//    "message": "Unknown flock flag: foo" }

