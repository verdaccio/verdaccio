// ensure that all arguments are validated
import path from 'path';
import fs from 'fs';

/**
 * Validate.
 app.param('package', validate_pkg);
 app.param('filename', validate_name);
 app.param('tag', validate_name);
 app.param('version', validate_name);
 app.param('revision', validate_name);
 app.param('token', validate_name);
 */
describe('api endpoint app.param()', () => {
  const file = '../endpoint/index.ts';
  let m;
  const requirePath = path.normalize(path.join(__dirname + '/../../../../src/api/web/', file));
  const source = fs.readFileSync(requirePath, 'utf8');
  const very_scary_regexp = /\n\s*app\.(\w+)\s*\(\s*(("[^"]*")|('[^']*'))\s*,/g;
  const appParams = {};

  while ((m = very_scary_regexp.exec(source)) != null) {
    if (m[1] === 'set') continue;

    let inner = m[2].slice(1, m[2].length-1);
    var t;

    inner.split('/').forEach(function(x) {
      t = x.match(/^:([^?:]*)\??$/);
      if (m[1] === 'param') {
        appParams[x] = 'ok';
      } else if (t) {
        appParams[t[1]] = appParams[t[1]] || m[0].trim();
      }
    });
  }

  test.each(Object.keys(appParams))('should validate ":%s"', (param) => {
    expect(appParams[param]).toEqual('ok');
  });
});
