'use strict';

describe('config.yaml', function() {
  it('should be parseable', function() {
    let source = require('fs').readFileSync(__dirname + '/../../conf/default.yaml', 'utf8');
    require('js-yaml').safeLoad(source);
  });
});

