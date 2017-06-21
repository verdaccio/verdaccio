'use strict';

let ReadTarball = require('../../src/lib/storage/streams').ReadTarball;

describe('mystreams', function() {
  it('should delay events', function(cb) {
    let test = new ReadTarball();
    test.abort();
    setTimeout(function() {
      test.abort = function() {
        cb();
      };
      test.abort = function() {
        throw Error('fail');
      };
    }, 10);
  });
});

