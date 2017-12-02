'use strict';

const assert = require('assert');

module.exports = function(server) {

    test('who am I?', () => {
      return server.whoami().then(function (username) {
        assert.equal(username, 'test');
      });
    });

};

