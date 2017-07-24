/**
 * Created by jpicado on 7/24/17.
 */
'use strict';

const assert = require('assert');

module.exports = function() {
  let server = process.server;
  let server2 = process.server2;

  describe('should test readme', () => {

    before(function() {
      return server.request({
        uri: '/readme-test',
        headers: {
          'content-type': 'application/json',
        },
        method: 'PUT',
        json: require('./pkg-readme.json'),
      }).status(201);
    });

    it('add pkg', function() {});

    describe('should check readme file', () => {
      const matchReadme = (server) => {
        return server.request({
          uri: '/-/verdaccio/package/readme/readme-test'
        }).status(200).then(function(body) {
          assert.equal(body, '<p>this is a readme</p>\n');
        });
      };

      it('server1 - readme', function() {
        return matchReadme(server);
      });

      it('server2 - readme', function() {
        return matchReadme(server2);
      });

    });
  });
};
