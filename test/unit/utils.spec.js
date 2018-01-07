'use strict';

let assert = require('assert');
let validate = require('../../src/lib/utils').validate_name;

describe('Validate', () => {
  test('good ones', () => {
    assert( validate('verdaccio') );
    assert( validate('some.weird.package-zzz') );
    assert( validate('old-package@0.1.2.tgz') );
  });

  test('uppercase', () => {
    assert( validate('EVE') );
    assert( validate('JSONStream') );
  });

  test('no package.json', () => {
    assert( !validate('package.json') );
  });

  test('no path seps', () => {
    assert( !validate('some/thing') );
    assert( !validate('some\\thing') );
  });

  test('no hidden', () => {
    assert( !validate('.bin') );
  });

  test('no reserved', () => {
    assert( !validate('favicon.ico') );
    assert( !validate('node_modules') );
    assert( !validate('__proto__') );
  });

  test('other', () => {
    assert( !validate('pk g') );
    assert( !validate('pk\tg') );
    assert( !validate('pk%20g') );
    assert( !validate('pk+g') );
    assert( !validate('pk:g') );
  });
});
