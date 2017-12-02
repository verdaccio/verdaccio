'use strict';

const assert = require('assert');
const _ = require('lodash');

module.exports = function(server) {

  test('ping', () => {
    return server.ping().then(function (data) {
      // it's always an empty object
      assert.ok(_.isObject(data));
    });
  });

};

