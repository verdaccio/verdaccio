'use strict';

const assert = require('assert');

module.exports = function(server) {

    it('who am I?', function () {
      return server.whoami().then(function (username) {
        assert.equal(username, 'test');
      });
    });

};

