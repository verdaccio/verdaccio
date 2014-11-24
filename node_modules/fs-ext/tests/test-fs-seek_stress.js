
// Stress test these APIs as published in extension module 'fs-ext'
// Specifically, try to exercise any memory leaks by simple repetition.

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

// We assume that test-fs-seek.js has run successfully before this 
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


// If we do quite a lot of nothing, how much does memory change?
if (0) {
  how_many_secs = 5;

  setTimeout(function ho_hum(){
    how_many_secs -= 1;
    if (how_many_secs > 0 ) {
      setTimeout(ho_hum,1000);
      return;
    }
    console.log('  After "do nothing" testing for %d seconds:', how_many_secs);
    display_memory_usage_now();
    console.log('        Time is %s', new Date());
  }, 
  1000 );
}


// Repeat a successful seekSync() call 
if( 1 ) {
  how_many_times = 10000000;
  //how_many_times = 4;

  for( var i=0 ; i<how_many_times ; i++ ) {
    tests_run++;
    result = err = undefined;
    result = fs.seekSync(file_fd, 0, 0);
    expect_value('seekSync', err, result, 0);
  }

  console.log('  After %d calls to successful seekSync():', how_many_times);
  display_memory_usage_now();
  console.log('        Time is %s', new Date());
}


// Repeat a successful seek() call 
if( 1 ) {
  how_many_times = 1000000;
  //how_many_times = 4;
  how_many_done  = 0;
 
  tests_run++;
  fs.seek(file_fd, 0, 0, function func_good_seek_cb(err, result){
    expect_value('seek', err, result, 0);
    if (debug_me) console.log('    seek call counter   %d', how_many_times );

    how_many_done += 1;
    if ( how_many_done < how_many_times ) {
      tests_run++;
      fs.seek(file_fd, 0, 0, func_good_seek_cb );
      return;
    }
    console.log('  After %d calls to successful seek():', how_many_times);
    display_memory_usage_now();
    console.log('        Time is %s', new Date());

    test_failing_seek();
  });
} else {
  test_failing_seek();
}  

function test_failing_seek() {

  if (1) {
    how_many_times = 1000000;
    //how_many_times = 4;
    how_many_done  = 0;
 
    tests_run++;
    fs.seek(-99, 0, 0, function func_good_seek_cb(err, result){
      expect_errno('seek', err, result, 'EBADF');
      if (debug_me) console.log('    seek call counter   %d', how_many_times );

      how_many_done += 1;
      if ( how_many_done < how_many_times ) {
        tests_run++;
        fs.seek(-99, 0, 0, func_good_seek_cb );
        return;
      }
      console.log('  After %d calls to failing seek():', how_many_times);
      display_memory_usage_now();
      console.log('        Time is %s', new Date());
    });
  } else {
  }

}



//------------------------------------------------------------------------------
//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  

// ### fs.seek(fd, offset, whence, [callback])

// ### fs.seekSync(fd, offset, whence)

// err { "stack":   "TypeError: Bad argument\n    at Object.seekSync (/home/Tom/study/javascript/node.js/baudehlo-node-fs-ext-3a489b7_/fs-ext.js:80:18)\n    at Object.<anonymous> (/home/Tom/study/javascript/node.js/baudehlo-node-fs-ext-3a489b7_/tests/test-fs-seek.js:101:12)\n    at Module._compile (module.js:407:26)\n    at Object..js (module.js:413:10)\n    at Module.load (module.js:339:31)\n    at Function._load (module.js:298:12)\n    at Array.0 (module.js:426:10)\n    at EventEmitter._tickCallback (node.js:126:26)",
//       "message": "Bad argument"}

// err { "stack":   "Error: EBADF, Bad file descriptor\n    at Object.seekSync (/home/Tom/study/javascript/node.js/baudehlo-node-fs-ext-3a489b7_/fs-ext.js:80:18)\n    at Object.<anonymous> (/home/Tom/study/javascript/node.js/baudehlo-node-fs-ext-3a489b7_/tests/test-fs-seek.js:137:12)\n    at Module._compile (module.js:407:26)\n    at Object..js (module.js:413:10)\n    at Module.load (module.js:339:31)\n    at Function._load (module.js:298:12)\n    at Array.0 (module.js:426:10)\n    at EventEmitter._tickCallback (node.js:126:26)",
//       "message": "EBADF, Bad file descriptor",
//       "errno":   9,
//       "code":    "EBADF"}

//XXX Does seek() return current position correctly?
//  fseek() doesn't return positions, only ftell() does that
//  ahh, but lseek() does return current positions  !!!
//
//  RETURN VALUE
//    Upon  successful completion, lseek() returns the resulting offset loca‐
//    tion as measured in bytes from the beginning of the  file.   On  error,
//    the  value  (off_t) -1  is  returned  and  errno is set to indicate the
//    error.

