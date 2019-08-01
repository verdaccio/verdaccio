'use strict';

let assert = require('assert');
let validate = require('../../src/lib/utils').validate_name;

describe('Validate', function() {
  it('good ones', function() {
    assert( validate('verdaccio') );
    assert( validate('some.weird.package-zzz') );
    assert( validate('old-package@0.1.2.tgz') );
    assert( validate('-build-infra') );
  });

  it('uppercase', function() {
    assert( validate('EVE') );
    assert( validate('JSONStream') );
  });

  it('no package.json', function() {
    assert( !validate('package.json') );
  });

  it('no path seps', function() {
    assert( !validate('some/thing') );
    assert( !validate('some\\thing') );
  });

  it('no hidden', function() {
    assert( !validate('.bin') );
  });

  it('no reserved', function() {
    assert( !validate('favicon.ico') );
    assert( !validate('node_modules') );
    assert( !validate('__proto__') );
  });

  it('other', function() {
    assert( !validate('pk g') );
    assert( !validate('pk\tg') );
    assert( !validate('pk%20g') );
    assert( !validate('pk+g') );
    assert( !validate('pk:g') );
  });
});
