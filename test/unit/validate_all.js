'use strict';

// ensure that all arguments are validated

const assert = require('assert');
const path = require('path');

describe('index.js app', test('index.js'));
describe('api.js app', test('api/api.js'));
describe('index.js app', test('index.js'));

function test(file) {
  return function() {

    let requirePath = path.normalize(path.join(__dirname + '/../../lib/web/', file));
    let source = require('fs').readFileSync(requirePath, 'utf8');

    let very_scary_regexp = /\n\s*app\.(\w+)\s*\(\s*(("[^"]*")|('[^']*'))\s*,/g;
    let m;
    let params = {};

    while ((m = very_scary_regexp.exec(source)) != null) {
      if (m[1] === 'set') continue;

      let inner = m[2].slice(1, m[2].length-1);
      var t;

      inner.split('/').forEach(function(x) {
        t = x.match(/^:([^?:]*)\??$/);
        if (m[1] === 'param') {
          params[x] = 'ok';
        } else if (t) {
          params[t[1]] = params[t[1]] || m[0].trim();
        }
      });
    }

    Object.keys(params).forEach(function(param) {
      it('should validate ":'+param+'"', function() {
        assert.equal(params[param], 'ok');
      });
    });
  };
}

