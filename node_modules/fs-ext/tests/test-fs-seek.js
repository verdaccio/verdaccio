
// Test these APIs as published in extension module 'fs-ext'

//    fs.seek(fd, offset, whence, [callback])
//
//  Asynchronous lseek(2).  
//
//  callback will be given two arguments (err, currFilePos).
// 
//  whence can be 0 (SEEK_SET) to set the new position in bytes to offset, 
//  1 (SEEK_CUR) to set the new position to the current position plus offset 
//  bytes (can be negative), or 2 (SEEK_END) to set to the end of the file 
//  plus offset bytes (usually negative or zero to seek to the end of the file).
//
//    fs.seekSync(fd, offset, whence)
//
//  Synchronous lseek(2). Throws an exception on error.  Returns current
//  file position.


// Ideas for testing borrowed from bnoordhuis (Ben Noordhuis)


//TODO and Questions

//XXX Combine seek() calls with calls to write() and read() to verify that 
//  the file position is being correctly reset.

//XXX Test specific values for 'whence' constants?  


//XXX Actually, if you are going to document the specific values,
//  0, 1, and 2, for the equivalent 'meanings' SEEK_SET/_CUR/_END,
//  then you are implying that even if other library implementations 
//  use different system values you will be translating from 0/1/2 to 
//  the system values.  
//  So... shouldn't define module constants SEEK_SET/_CUR/_END using the
//  system values, but rather as own constants, and translate to system
//  values inside API.
//  Or... don't document 0/1/2 and require use of system values, and
//  constants from system library values.


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
    file_path     = path.join(tmp_dir, 'what.when.seek.test'),
    file_path_not = path.join(tmp_dir, 'what.not.seek.test');

var file_fd,
    result,
    err,
    offset_big;


// Report on test results -  -  -  -  -  -  -  -  -  -  -  -

// Clean up and report on final success or failure of tests here
process.addListener('exit', function listen_for_exit(exit_code) {
  //if (debug_me) console.log('    exit_code  %j', exit_code);

  try {
    fs.closeSync(file_fd);
  } catch (e) {
    // might not be open, that's okay.
  }

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
      fault_msg = api_name + '(): wrong value \'' + value_seen +
                                   '\'  (expecting ' + value_expected + ')';
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

  if (debug_me) console.log('  expected_errno(err):  %j', err );

  if ( err ) {
    if ( err instanceof Error ) {
      if ( err.code !== undefined ) {
        if ( err.code !== expected_errno ) {
            fault_msg = api_name + '(): returned wrong errno \'' + err.message +
                                      '\'  (expecting ' + expected_errno + ')';
          }
      } else {
        fault_msg = api_name + '(): returned wrong error \'' + err + '\'';
        console.log('  (We see non-errno error %j', err);
      }
    } else {
      fault_msg = api_name + '(): returned wrong error \'' + err + '\'';
      console.log('  (We see non-Error error %j', err);
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


function expect_error(api_name, err, value_seen, expected_error) {
  var fault_msg;

  if (debug_me) console.log('  expected_error(err):  %j', err );

  if ( err ) {
    if ( err instanceof Error ) {
      if ( err.code !== undefined ) {
          fault_msg = api_name + '(): returned wrong error \'' + err.message +
                                    '\'  (expecting ' + expected_error + ')';
      } else if ( err.message !== undefined ) {
        if ( err.message !== expected_error ) {
          fault_msg = api_name + '(): returned wrong error \'' + err + '\'';
          console.log('  (We see non-errno error %j', err);
        }
      } else {
        fault_msg = api_name + '(): returned wrong error \'' + err + '\'';
        console.log('  (We see non-errno error %j', err);
      }
    } else {
      fault_msg = api_name + '(): returned wrong error \'' + err + '\'';
      console.log('  (We see non-Error error %j', err);
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

// Check whether this version of node.js has these APIs to test
//XXX Consider just exiting without error after displaying notices

tests_run++;
if ( typeof fs.seek !== 'function' ) {
  console.log('fs.seek API is missing'); 
} else {  
  tests_ok++;
}

tests_run++;
if ( typeof fs.seekSync !== 'function' ) {
  console.log('fs.seekSync API is missing');
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

var constant_names = [ 'SEEK_SET',  'SEEK_CUR',  'SEEK_END' ];

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
result = err = undefined;
try {
  result = fs.seekSync(undefined, 0, 0);
} catch (e) {
  err = e;
}
expect_error('seekSync', err, result, 'Bad argument');


// fd value is non-number 

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync('foo', 0, 0);
} catch (e) {
  err = e;
}
expect_error('seekSync', err, result, 'Bad argument');


// fd value is negative 

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(-9, 0, 0);
} catch (e) {
  err = e;
}
expect_errno('seekSync', err, result, 'EBADF');


// fd value is 'impossible' 

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(98765, 0, 0);
} catch (e) {
  err = e;
}
expect_errno('seekSync', err, result, 'EBADF');


// whence value is invalid

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 0, 98765);
} catch (e) {
  err = e;
}
expect_errno('seekSync', err, result, 'EINVAL');


tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 0, -99);
} catch (e) {
  err = e;
}
expect_errno('seekSync', err, result, 'EINVAL');


// offset value is negative

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, -98765, 0);
} catch (e) {
  err = e;
}
expect_errno('seekSync', err, result, 'EINVAL');


// offset value is non-integer

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 4.0001, 0);
} catch (e) {
  err = e;
}
expect_error('seekSync', err, result, 'Not an integer');


// offset value is "too big" (beyond end of file) 
//   This unexpectedly 'works' ...

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 98765, 0);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, 98765);


// offset value is "very big" (from below to beyond 32 bits) 

tests_run++;
result = err = undefined;
offset_big = 2 * 1024 * 1024 * 1024 - 1;
try {
  result = fs.seekSync(file_fd, offset_big, 0);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, offset_big);


tests_run++;
result = err = undefined;
offset_big = 2 * 1024 * 1024 * 1024;
try {
  result = fs.seekSync(file_fd, offset_big, 0);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, offset_big);


tests_run++;
result = err = undefined;
offset_big = 42 * 1024 * 1024 * 1024;
try {
  result = fs.seekSync(file_fd, offset_big, 0);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, offset_big);


tests_run++;
result = err = undefined;
offset_big = 8 * 1024 * 1024 * 1024 * 1024 - 1;
// Linux is limited to 43 bits for file position values?
try {
  result = fs.seekSync(file_fd, offset_big, 0);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, offset_big);


// This test now works under Node v0.8
// tests_run++;
// result = err = undefined;
// offset_big = 16 * 1024 * 1024 * 1024 * 1024;
// // Linux is limited to 43 bits for file position values?
// //console.log('    offset_big   %s    %s', offset_big.toString(), offset_big.toString(16) );
// try {
//   result = fs.seekSync(file_fd, offset_big, 0);
//   //console.log('    result       %s    %s', result.toString(), result.toString(16) );
// } catch (e) {
//   err = e;
// }
// expect_errno('seekSync', err, result, 'EINVAL');



// Test valid calls: seekSync  -  -  -  -  -  -  -  -  -  - 

// SEEK_SET to 0

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 0, 0);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, 0);


// SEEK_CUR to 0

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 0, 1);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, 0);


// SEEK_END to 0

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 0, 2);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, 0);


// SEEK_SET to 0 using published constant

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 0, fs_binding.SEEK_SET);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, 0);


// SEEK_CUR to 0 using published constant

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 0, fs_binding.SEEK_CUR);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, 0);


// SEEK_END to 0 using published constant

tests_run++;
result = err = undefined;
try {
  result = fs.seekSync(file_fd, 0, fs_binding.SEEK_END);
} catch (e) {
  err = e;
}
expect_value('seekSync', err, result, 0);




// Test valid calls: seek  -  -  -  -  -  -  -  -  -  -  - 

// SEEK_SET to 0

tests_run++;
fs.seek(file_fd, 0, 0, function(err, result) {
  expect_value('seek', err, result, 0);

  tests_run++;
  fs.seek(file_fd, 0, 1, function(err, result) {
    expect_value('seek', err, result, 0);

    tests_run++;
    fs.seek(file_fd, 0, 2, function(err, result) {
      expect_value('seek', err, result, 0);

      // Test invalid calls: seek  -  -  -  -  -  -  -  -  - 

      // offset value is negative
      tests_run++;
      fs.seek(file_fd, -98765, 0, function(err, result) {
        expect_errno('seek', err, result, 'EINVAL');

        // offset value is quite large (over 32 bits)
        tests_run++;
        offset_big = 42 * 1024 * 1024 * 1024;
        fs.seek(file_fd, offset_big, 0, function(err, result) {
          expect_value('seek', err, result, offset_big);
        });
      });
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
//     { stack: [Getter/Setter],
//       arguments: undefined,
//       type: undefined,
//       message:   'EINVAL, Invalid argument',
//       errno:     22,
//       code:      'EINVAL' }
